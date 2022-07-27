const fs=require('fs')


const axios = require('axios');



class Busquedas{

    historial=[];
    dbPath='./db/database.json';


    constructor(){
        this.leerDB();
    }


    get historialCapitalizado(){

        

        return this.historial.map(lugar=>{

            let palabras=lugar.split(" ");

            //Una forma
            /* for(let i=0; i<palabra.length; i++){
                palabra[i]=palabra[i].charAt(0).toUpperCase() + palabra[i].slice(1);
            } */

            palabras=palabras.map(p=>p[0].toUpperCase()+p.substring(1));
            return palabras.join(" ");

  
        })



    }


    get paramsMapbox(){
        return{

                'limit': 5,
                'language': 'es',
                'access_token':process.env.MAPBOX_KEY
        }
    }

    get paramsOpenWeather(){
        return{
            
                'lang':'es',
                'units':'metric',
                'appid':process.env.OPENWEATHER_KEY
        }
    }



    async ciudad(lugar=''){


        try{        
            
            // Petición HTTP

            const intance=axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params:this.paramsMapbox
             
            })

            const resp= await intance.get();
         //retorna los lugares 
            return resp.data.features.map(lugar=>({
                id:lugar.id,
                nombre:lugar.place_name,
                lng:lugar.center[0],
                lat:lugar.center[1]

            }));


         

            
        }catch(error){
            return [];

        }

    }



    async climaLugar(lat, lon){



        
        try{

            const instance=axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params:this.paramsOpenWeather

            })

            
            //resp.data
            const resp=await instance.get();

            const {main, weather}=resp.data;


           
           
            return ({
        
                
                desc:weather[0].description, 
                min:main.temp_min,
                max:main.temp_max,
                norm:main.temp 

           }); 

 

        }catch(error){
            console.log(error);
        }
    }

    agregarHistorial(lugar=""){
        //TODO: prevenir duplicados

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial=this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());



        this.guardarDB();
    

    }


        //grabar en DB

        guardarDB(){

            const payload={
                historial:this.historial
            }

            fs.writeFileSync(this.dbPath, JSON.stringify(payload));
            
        }

        leerDB(){
            

            if(!fs.existsSync(this.dbPath)){
                return null;
            }

           const info=fs.readFileSync(this.dbPath, {encoding:'utf-8'})

           const data=JSON.parse(info);

            this.historial=data.historial;

    
        }



}

module.exports=Busquedas;