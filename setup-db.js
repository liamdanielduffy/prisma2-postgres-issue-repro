const { execSync } = require('child_process')

const containers_running = execSync("docker ps -a -q").toString().length > 0
const stopAllContainers = () => execSync("docker stop $(docker ps -a -q)");

if(containers_running) {
    stopAllContainers()
}

const branch_head_commit_hash = execSync("git rev-parse HEAD").toString().trim();
const dev_db_name_config = "--name " + branch_head_commit_hash
const dev_db_cleanup_flag = "--rm"
const dev_db_password_config = "-e POSTGRES_PASSWORD=password"
const detached_mode_flag = "-d"
const dev_db_port_config = "-p 5432:5432"

const createDatabase = () => {
    execSync(`docker run ${dev_db_cleanup_flag} ${dev_db_name_config} ${dev_db_password_config} ${detached_mode_flag} ${dev_db_port_config} postgres`)
}

createDatabase()



const addLineToTopOfPrismaFile = (line) => execSync(`echo '${line}' | cat - ./prisma/project.prisma > temp && mv temp ./prisma/project.prisma`)
const deleteOldDbConfiguration = () => execSync("ex -s -c '1d5|x' ./prisma/project.prisma");

const database_url = "postgresql://postgres:password@localhost:5432/" + branch_head_commit_hash;
const addNewDbConfiguration = () => {
    addLineToTopOfPrismaFile("");
    addLineToTopOfPrismaFile("}");
    addLineToTopOfPrismaFile(`url = "${database_url}"`);
    addLineToTopOfPrismaFile('provider = "postgres"');
    addLineToTopOfPrismaFile("datasource db {");
}


deleteOldDbConfiguration()
addNewDbConfiguration()
