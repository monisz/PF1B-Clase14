const fs = require('fs');

class Container {
    constructor (fileName) {
        this.fileName = fileName;
        this.id = 1;
    }    

    async save(element) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            element['id'] = contentParse.length + 1;
            contentParse.push(element);
            try {
                await fs.promises.writeFile(this.fileName, JSON.stringify(contentParse, null, 2));
                console.log("escritura exitosa");
            }
            catch (error) {
                console.log("el error al escribir fue: ", error);
            }
            return element.id;
        }
        catch (error) {
            console.log("error al leer (en Save): ", error);
        }
    }
    

    //Agregué este método para complementar el put por id
    async replaceById(id, data) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            data["id"] = id;
            contentParse[id-1] = data;
            try {
                await fs.promises.writeFile(this.fileName, JSON.stringify(contentParse, null, 2));
                console.log("escritura exitosa");
            }
            catch (error) {
                console.log("el error al escribir fue: ", error);
            }
            return contentParse[id-1];
        }
        catch (error) {
            console.log("error al leer (en Save): ", error);
        }
    }

    async getById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            const objectFinded = contentParse.find((obj) => obj.id === id);
            if (objectFinded) {
                return objectFinded;
            } else {
                return null;
            }
        }
        catch (error) {
            console.log("error al buscar por id: ", error);
        }
    }

    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            return contentParse;
        }
        catch (error) {
            console.log("error al leer (en getAll): ", error)
            return [];
        }
    }

    async deleteById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf-8');
            const contentParse = JSON.parse(content);
            const idFind = contentParse.find((elem) => elem.id === id);            
            if (!idFind) console.log("error: ese carrito no existe")
            else {
                const newContent = contentParse.filter((elem) => elem.id !== id)
                try {
                    await fs.promises.writeFile(this.fileName, JSON.stringify(newContent, null, 2));
                    console.log("escritura exitosa en deleteById");
                }
                catch (error) {
                    console.log("el error al escribir (en deleteById) fue: ", error);
                }
                return contentParse;
            }
        }
        catch (error) {
            console.log("error al leer (en deleteById): ", error);
        }
    }
}


//Para chequear si existen los archivos
const exists = (fileName) => {
    const fileExists = fs.existsSync(fileName);
    if (!fileExists) {
        fs.writeFileSync(fileName, "[]");
        console.log("archivo creado");
    };
};

exists("productos.txt");
exists("carrito.txt");


module.exports = Container;

