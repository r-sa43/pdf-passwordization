FROM ubuntu:20.04

# Update the list of packages
RUN apt-get update
# Install pre-requisite packages.
RUN apt-get install -y wget apt-transport-https software-properties-common
# Download the Microsoft repository GPG keys
RUN wget -q "https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb"
# Register the Microsoft repository GPG keys
RUN dpkg -i packages-microsoft-prod.deb
# Update the list of packages after we added packages.microsoft.com
RUN apt-get update
# Install PowerShell
RUN apt-get install -y powershell

# Install pdftk
RUN apt-get install -y pdftk

# Install kintone-cli(デフォルトで同梱するため実行しない)
# RUN apt-get install -y unzip
# RUN wget -q "https://github.com/kintone-labs/cli-kintone/releases/download/v0.13.1/linux-x64.zip"
# RUN unzip linux-x64.zip

# RUN cp build/linux-x64/cli-kintone /app/
# RUN rm -rf build linux-x64.zip packages-microsoft-prod.deb

RUN rm -rf packages-microsoft-prod.deb