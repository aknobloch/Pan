# Prerequisites
* Ubuntu 16.04 machine - [Install Guide](https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-server#0)
* LXD, Bridge-Utils and ZFSUtils installed. - `sudo apt-get install lxd bridge-utils zfsutils-linux -y`

# LXD Setup
### LXC/D Setup
LXC is a container framework for Linux machines. It can be thought of as a hybird between a chroot jail and a         virtual machine. Using containers allows the server application to be secure, easily backed up and easily switched between different servers. This allows development and testing on a local machine and an easy migraton of the entire container to a deployment server. For setting up a container, we will be using the LXD tool that is installed by default on Ubuntu 16.04. LXD is a wrapper around the lower-level LXC tool, with some additional features and benefits. More reading can be found [here](https://discuss.linuxcontainers.org/t/comparing-lxd-vs-lxc/24). This install guide mostly follows the one found on [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04), but specific to Pan. 
1. First, add yourself to the LXD group so we can manage containers. `sudo usermod --append --groups lxd $USER`. If using SSH, you may need to log back in to update the session w/ this new membership.
2. Initialize the LXD container using `sudo lxd init`. A series of questions and answers will follow, the options chosen are summarize below:
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
3. For more information on any of the above options, visit [the DigitalOcean walkthrough](https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04#step-2-%E2%80%94-configuring-networking) or Google. You should get a message indicating the lxd.service was stopped, and that LXD was suiccessfully configured. 
