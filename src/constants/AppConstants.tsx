import Path from 'path';

export default class AppConstants {

    static REQUIRE_PASSWORD = true;
    static PASSWORD = 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=';

    static PROGRESS_TIMEOUT_IN_SECS = 180;

    static SOURCE = Path.join('resources\\package');
    static TARGET = Path.join('C:\\');
    
    static FXCHOICE_PATH = Path.join('fxchoice');
    static FXCHOICE_MANAGER_PATH = Path.join('fxchoiceservicemanager');

    static HIDE_INSTALL = false;
    static INSTALL_SERVICE_PATH = Path.join('bat', 'installService.bat');
    static INSTALL_MANAGER_SERVICE_PATH = Path.join('bat', 'installService.bat');

    static HIDE_UNINSTALL = false;
    static UNINSTALL_SERVICE_PATH = Path.join('bat', 'uninstallService.bat');
    static UNINSTALL_MANAGER_SERVICE_PATH = Path.join('bat', 'uninstallService.bat');

    static START_SERVICE_PATH = Path.join('bat', 'startService.bat');
    static START_MANAGER_SERVICE_PATH = Path.join('bat', 'startService.bat');

}