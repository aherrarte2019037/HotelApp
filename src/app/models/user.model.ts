export interface User {
    _id       : string;
    username  : string;
    email     : string;
    firstname : string;
    lastname  : string;
    password  : string;
    role?     : UserRoles;
}

enum UserRoles {
    client      = 'client',
    hotel_admin = 'hotel_admin',
    app_admin   = 'app_admin'
}