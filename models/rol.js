import { model, Schema } from "mongoose";


const RoleSchema = Schema({
    rol:{
        type: String,
        required: true,
    }

});

const Role = model( 'Role', RoleSchema );
export default Role;

