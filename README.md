[![npm version](https://badge.fury.io/js/homebridge-raspberrypi-remote.svg)](https://badge.fury.io/js/homebridge-raspberrypi-remote)

# homebridge-raspberrypi-remote

This is Raspberry Pi Remote plugin for [Homebridge](https://github.com/nfarina/homebridge). 



### Features

* Display Raspberry Pi state.



### Installation

1. Install required packages.

   ```
   npm install -g homebridge-raspberrypi-remote
   ```

2. Check the OS of Raspberry Pi.

3. Add these values to `config.json`.

    ```
      "accessories": [
        {
          "accessory": "RespberryPi",
          "name": "Respberry Pi",
          "os": "linux",
          "interval": 5000,
          "showCpuUsage": false,
          "showMemoryUsage": false,
          "showTemperature": true,
          "enableReboot": true
        }
      ]
    ```

4. Restart Homebridge, and your Raspberry Pi will be added to Home app.



### License

See the [LICENSE](https://github.com/clauzewitz/homebridge-raspberrypi-remote/blob/master/LICENSE.md) file for license rights and limitations (MIT).
