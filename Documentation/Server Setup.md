# Prerequisites
* Ubuntu 16.04 machine - [Install Guide](https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-server#0)
* LXD, Bridge-Utils and ZFSUtils installed. - `sudo apt-get install lxd bridge-utils zfsutils-linux -y`

# LXD Container Setup
### LXC/D Initialization
LXC is a container framework for Linux machines. It can be thought of as a hybird between a chroot jail and a         virtual machine. Using containers allows the server application to be secure, easily backed up and easily switched between different servers. This allows development and testing on a local machine and an easy migraton of the entire container to a deployment server. For setting up a container, we will be using the LXD tool that is installed by default on Ubuntu 16.04. LXD is a wrapper around the lower-level LXC tool, with some additional features and benefits. More reading can be found [here](https://discuss.linuxcontainers.org/t/comparing-lxd-vs-lxc/24). This install guide mostly follows the one found on [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04), but specific to Pan. 
1. First, add yourself to the LXD group so we can manage containers. `sudo usermod --append --groups lxd $USER`. If you are SSH'd into a remote machine, you may need to log back in to update the session w/ this new membership.
2. Initialize the LXD container using `sudo lxd init`. A series of questions and answers will follow, the options chosen are summarized below:
    * Create new storage pool? **Yes**
    * Use DIR or ZFS? **ZFS**
    * Create a new ZFS pool? **Yes**
    * Name of ZFS pool? **lxd_pan**
    * Use existing block device? **No** 
    * Size in GB of the new loop device? **20**
    * Should LXD be available over the network? **No**
    * Configure the LXD bridge? **Yes**
    * (GUI Screen) Would you like to setup a network bridge? **Yes**
    * (GUI Screen) Name of the container? **lxdbr0**
    * (GUI Screen) Setup IPv4 subnet? **Yes**
    * (GUI Screen) Confirm subnet not in use. **Unless you know why you need to change it, leave defaults.**
    * (GUI Screen) Do you want to NAT traffic? **Yes**
    * Create IPv6 subnet? **No**
3. For more information on any of the above options, visit [the DigitalOcean walkthrough](https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04#step-2-%E2%80%94-configuring-networking) or Google. You should get a message indicating the lxd.service was stopped, and that LXD was successfully configured. 

### Create Pan Server container
1. Run `lxc list` to generate the client certificate.
2. Create a Ubuntu 16.06-based server container via `lxc launch ubuntu:16.04 pan-server`.
3. You can confirm that the server is started via `lxc list`.
      * On my machine, running `lxc list` showed that the server did not have an entry for the IPv4 address. To solve this, I had to follow the solution provided by raymov on [this](https://github.com/lxc/lxd/issues/1298) issue thread. His solution is the last comment on the page.
4. Next, let's verify that the server is working properly and as intended. First, we can enter a terminal shell for the server using the preconfigured "ubuntu" user. To do this, execute `lxc exec pan-server -- sudo --login --user ubuntu`. 
      * The first `--` string denotes that the command parameters for lxc should stop there, and the rest of the line will be passed as the command to be executed inside the container. The command is `sudo --login --user ubuntu`, which provides a login shell for the preconfigured (sudoer) account "ubuntu" inside the container.
      * Once inside the container shell, you can think of it as its own virtual machine. Any commands run using root permissions will be contained to this container, and all packages and apps installed will be specific to this machine.
5. Test that we have access to the network outside of this machine by running `ping google.com`. You should see succesful pings. If you do not have network access, you can try referring to the notes under step 3.


**By default, this container is not accessible to the outside world. We will need to configure the host machine to forward traffic on specific ports to this container, but before doing that, we will need to set up the server.**

# Setting up a Database
Python includes SQLite3. You're done. Horray!

The decision to use SQLite3 was chosen via the information [here](https://www.sqlite.org/whentouse.html). Here are the justifications behind using SQLite rather than a full-blown RDBMS:
* We don't expect high volume.
* We don't require direct DB access, it will be managed through the Django application.
* We aren't worried about concurrency issues. Concurrent reading is possible in SQLite3, and since results can be returned and then the results written, we don't have to worry about performance issues from the client. 
* We don't expect high volumes of data (>140 TB files). Logs and web page results will be considered obsolete and cleared after a yet to determined timestamp. 

# Setting up Django REST Framework
In the preceding setup, it is implied that you are operating in the pan-server container shell. To enter this shell, execute `lxc exec pan-server -- sudo --login --user ubuntu` on the host machine.

This section was aided by the tutorial found [here](http://www.django-rest-framework.org/tutorial/quickstart/), with specifics for the Pan installation. 

Django requires Python 3 to be installed. The Ubuntu 16.04 installation should include this, but you can be sure by running `python3 --version`. For me, I also like to run python scripts without typing `python3` as the command, so I add an alias via `echo "alias python=python3" >> ~/.bashrc`.
 
1. Find a directory for the server source to reside in, and clone the git repository.
2. Navigate into the `PanServer` directory, then run `python3 manage.py runserver`
3. You should now be able to access the server REST API via `curl` directives from inside the container, using the local loopback. To access the server from outside, port forwarding on the host machine still needs to be configured.

# Forwarding to the Server
Before continuing with this section, you should understand the security implications related to exposing a server to the outside world. The Pan container is a relatively secure environment, but if the PanServer is running on a network and host machine that allows incoming port 8000 connections, the following configuration will open the PanServer to the world. **This is obviously not ideal for development purposes, so make sure you know what you are doing.**

A server container for Pan is now running, with the PanServer project running on it. You can connect to the REST API via the local loopback in the container, but we still need to give access from the internet. The Pan server uses port 8000 to listen for API POST/GET requests. 

1. First, we need to run PanServer to listen for all incoming traffic. Inside the container shell, start the server via `python3 manage.py runserver 0.0.0.0:8000`. To make sure that works, you should now be able to `curl` the server from the host machine, as well as the container shell. **If you are developing on the same machine you are running the server on, you may stop here.**
2. If the PanServer is running on a separate machine from your development machine, we need to configure the host machine to forward incoming connection to port 8000 to the container. For this, we can use iptables on the host machine via `sudo iptables -t nat -I PREROUTING -i <interface> -p TCP -d <public ip> --dport 8000 -j DNAT --to-destination <container ip>:8000 -m comment --comment "Forward to PanServer"'`. Make sure to replace `<public ip>` and `<container ip>` with the appropriate values for the host machine. Additionally, ensure that `<interface>` is replaced with the outward-facing interface of your host machine. For many machines, this is `eth0`, but you can find this by running `ifconfig`.



 



