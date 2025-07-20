const Pool=require("pg").Pool;

const pool= new Pool({
    user: "postgres",
    password: "mahbubapriya",
    host:"localhost",
    port: 5432,
    database:"job_portal"

});

module.exports=pool;