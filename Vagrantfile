require 'yaml'

Vagrant.require_version '>= 1.5'

Vagrant.configure("2") do |config|

    # Configure the box to use
    config.vm.box       = 'trusty64'
    config.vm.box_url   = 'http://files.vagrantup.com/trusty64.box'

    # Configure the network interfaces
    config.vm.network   :private_network, ip: "192.168.33.107"

    # Configure shared folders
    config.vm.synced_folder ".", "/var/www", id: "application",  :nfs => true, :linux__nfs_options => ["rw", "no_root_squash", "async"]

    # Configure VirtualBox environment
    config.vm.provider :virtualbox do |v|
        v.customize [ "modifyvm", :id, "--memory", 512 ]
        v.customize [ "modifyvm", :id, "--natdnshostresolver1", "on" ]
        v.customize [ "modifyvm", :id, "--natdnsproxy1", "on" ]
    end

    # Provision the box
    config.vm.provision :ansible do |ansible|
        ansible.verbose = "vv"
        ansible.playbook = "deployment/ansible/site.yml"
    end
end
