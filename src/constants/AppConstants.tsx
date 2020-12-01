import Path from 'path';

export default class AppConstants {

    static PASSWORD = '12345';

    static SOURCE = Path.join('resources\\package');
    static TARGET = Path.join('C:\\');
    
    static FXCHOICE_PATH = Path.join('fxchoice');
    static FXCHOICE_MANAGER_PATH = Path.join('fxchoiceservicemanager');

    static INSTALL_SERVICE_PATH = Path.join('bat', 'installService.bat');
    static INSTALL_MANAGER_SERVICE_PATH = Path.join('bat', 'installService.bat');

    static UNINSTALL_SERVICE_PATH = Path.join('bat', 'uninstallService.bat');
    static UNINSTALL_MANAGER_SERVICE_PATH = Path.join('bat', 'uninstallService.bat');

    static START_SERVICE_PATH = Path.join('bat', 'startService.bat');
    static START_MANAGER_SERVICE_PATH = Path.join('bat', 'startService.bat');

}