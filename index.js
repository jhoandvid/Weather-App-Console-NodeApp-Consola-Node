
require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const busquedas = new Busquedas();



const main = async () => {
    let opt;


    do {

        console.clear();

        opt = await inquirerMenu();


        switch (opt) {
            case 1:

                //Mostrar mensaje
                const termino = await leerInput("Ciudad: ");



                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);



                //Seleccionar el lugar
                const id = await listarLugares(lugares);

                if(id==='0') continue;

                

                const lugarSel = lugares.find(el => el.id === id);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);


                //Clima...

                const clima= await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);


                console.clear();
                //Mostrar lugares
                console.log('\n Informacion de la ciudad\n'.green)
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.norm);
                console.log('Mínima:', clima.max);
                console.log('Maxima:',clima.min);
                console.log('Descripción:', clima.desc.green);

                break;


                case 2:

                    busquedas.historialCapitalizado.forEach((lugar, i)=>{
                        const idx=`${i+1}.`.green
                        console.log(`${idx} ${lugar}`)
                    })


                break;

        }

        if (opt !== 0) await pausa();


    } while (opt !== 0)







}

main();