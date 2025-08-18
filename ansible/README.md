# Ansible K3s Setup

This playbook installs a K3s cluster.

## Requirements

Install the Ansible Galaxy role dependencies before running the playbook:

```bash
ansible-galaxy install -r requirements.yml
```

## Usage

Run the playbook against your inventory:

```bash
ansible-playbook -i inventory.ini site.yml
```

