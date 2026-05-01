> [!WARNING] 
> This repository is currently pre-alpha, breaking changes happen frequently, there have not been any security audits, and data loss is expected.

<p align="center">
  <img height="150" src="https://github.com/openminerva/account-server/blob/alpha/docs/logos/om-logo-big.webp?raw=true" />
</p>

[![](https://dcbadge.limes.pink/api/server/https://discord.gg/Kx6avB52gK)](https://discord.gg/Kx6avB52gK)

# Account Server

Account Server is the identity server service for the OpenMinerva client. 

## Overview

Account Server is the self hostable microservice for the OpenMinerva project that gives users the ability to authenticate themselves as users in the ecosystem.

## Quick Start
Installation and running on Linux.
```bash
# Clone this repository.
git clone https://github.com/OpenMinerva/account-server

# Navigate to the repository.
cd account-server

# Create the .env file from the template.
cp .env.template .env

# (Optional) Edit the .env file.
nano .env
```

From here you have two directions. For production use, you probably want to run the command 
```bash
./podman-run.sh # For production environments
```
Alternatively for development, you can simply run 
```bash
node server.js # For developing
```
to start the server on your local machine without a container.

This will firstly compile all [SASS](https://sass-lang.com/) files to regular css, then it will use [Podman](https://podman.io/) to build a container using the [Containerfile](https://github.com/OpenMinerva/account-server/blob/alpha/Containerfile) using the default port `40400`.
## Contributing
See [CONTRIBUTING.md](https://github.com/OpenMinerva/account-server/blob/alpha/CONTRIBUTING.md) for guidelines, and information.
