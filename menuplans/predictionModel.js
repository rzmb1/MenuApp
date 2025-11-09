const tf = require('@tensorflow/tfjs');

let { MenuPlan } = require('./menuplan');
let { Signup } = require('../signups/signup');
const mongoose = require('mongoose');
const { dateToStandardString } = require('../utils/dateFunctions');
const { logger } = require('../utils/logger');
const { Schema } = mongoose;
tf.env().set('IS_NODE', false);//disable warning to use other library
const MAX_DAYS_BEFORE=20;

const PredictionModel = mongoose.model('predictionModel',new Schema({
                                                                        model:String,
                                                                        weights:Array,
                                                                        meanSquaredError:Number,
                                                                        absoluteError:Number,
                                                                        minServed:Array,
                                                                        maxServed:Array,
                                                                        maxInputs:Array,
                                                                        minInputs:Array,
                                                                        dishNames:Array,
                                                                        dishAvg:Object}));

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

let predictionModel;
let minServed;
let maxServed;
let maxInputs;
let minInputs;
let dishAvg;
let dishNames;

function normalize(tensor,min,max) {
    return tensor.sub(min).div(max.sub(min));
}
function denormalize(tensor,min,max) {
    return tensor.mul(max.sub(min)).add(min);
}

function entrysToFeature(entrys) {
    
    return tf.tensor(entrys.map(entry => {
        let nameIdx =dishNames.indexOf(entry.name);
        return [entry.registered,
                entry.daysBefore,
                dishAvg[entry.name]?(dishAvg[entry.name].served):(Object.keys(dishAvg).map(key => dishAvg[key].served)/Object.keys(dishAvg).length),
                dishAvg[entry.name]?(dishAvg[entry.name].registered/dishAvg[entry.name].served):(Object.keys(dishAvg).map(key => dishAvg[key].registered/dishAvg[key].served)/Object.keys(dishAvg).length),
                nameIdx>-1?nameIdx:dishNames.length/2,
                entry.choicesVorspeise,
                entry.choicesHauptspeise,
                entry.choicesNachspeise]}));
}

async function createPredictionModel(){
    logger.info('training prediction model...');
    //get statistics data
    let menuPlans = await MenuPlan.find();
    if(menuPlans.length==0){
        throw {type:'failed prediction model precondition',message:'No Menuplan Data unable to train prediction model'};
    }
    let signupCounts = await Signup.aggregate([ {$group : {_id:{ day: "$day", dish: "$dish.name", date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } } }, count:{$sum:1}}}]);
    let statistics = [];
    menuPlans.forEach((mp) => { // iterate menu plans
        for (let day in mp.days) { // iterate days
            if (typeof (mp.days[day]) == "object") {
                let date = new Date(mp.startDate);
                date.setDate(date.getDate() + DAYS.indexOf(day));
                let daySignups = signupCounts.filter(count => count._id.day == [dateToStandardString(date)]);
                for (let meal of mp.days[day]) {
                    let mealSignups = daySignups.filter(count => count._id.dish == meal.name);
                    //split statistics entry into one for each day before
                    for(let daysBefore=0;daysBefore<=MAX_DAYS_BEFORE;daysBefore++) {
                        let regDate = new Date(date);
                        regDate.setDate(regDate.getDate()-daysBefore);
                        let entry = {
                            ...meal.statistics,
                            date: dateToStandardString(date),
                            name: meal.name,
                            registered: mealSignups.filter(count => new Date(count._id.date).getTime() <= regDate.getTime()).reduce((prev,curr) => prev+curr.count,0),
                            daysBefore: daysBefore,
                        };
                        ["Vorspeise","Hauptspeise","Nachspeise"].forEach(course =>{
                            entry['choices'+course]=meal.tags.includes(course)?mp.days[day].filter(choice => choice.tags.includes(course)).length:7;
                        });
                        statistics.push(entry);
                    }
                }
            }
        }
    });
    let filteredData = statistics.filter(entry => entry.served && entry.registered);
    if(filteredData.length==0){
        throw {type:'failed prediction model precondition',message:'No valid data to train prediction model'};
    }
    tf.util.shuffle(filteredData);
    dishNames = filteredData.sort((a,b) => a.served - b.served).map(entry => entry.name).filter((val,idx,arr) => arr.indexOf(val)===idx);
    dishAvg={};
    dishNames.forEach(name => {
        let entries=filteredData.filter(entry => entry.name==name);
        dishAvg[name]={
            served: entries.reduce((prev,curr)=>prev+curr.served,0)/entries.length,
            ordered: entries.reduce((prev,curr)=>prev+curr.ordered,0)/entries.length,
            wasted: entries.reduce((prev,curr)=>prev+curr.wasted,0)/entries.length,
            registered: entries.filter(entry => entry.daysBefore==0).reduce((prev,curr)=>prev+curr.registered,0)/(entries.filter(entry => entry.daysBefore==0).length??1)
        };
    });
    let testData=filteredData.slice(0,Math.floor(filteredData.length/5));
    let trainData=filteredData.slice(Math.floor(filteredData.length/5),filteredData.length);
    //format statistics data
    let features = entrysToFeature(trainData);
    maxInputs=features.max(0);
    minInputs=features.min(0);
    features = normalize(features,minInputs,maxInputs);
    let labels = tf.tensor(trainData.map(entry => entry.served));
    minServed = labels.min();
    maxServed = labels.max();
    labels = normalize(labels,minServed,maxServed);
    //create ml model
    let model = tf.sequential();
    model.add(tf.layers.dense({units:7, inputShape:[features.shape[1]]}));
    model.add(tf.layers.dense({units:5}));
    model.add(tf.layers.dense({units:1}));
    model.compile({loss:'meanSquaredError', optimizer:'sgd'});
    await  model.fit(features,labels,{epochs:100});
    predictionModel = model;
    //test prediction model
    let testLabels=tf.tensor(testData.map(entry => [entry.served]));
    let testFeatures=normalize(entrysToFeature(testData),minInputs,maxInputs);
    let testPredictions=denormalize(predictionModel.predict(testFeatures),minServed,maxServed);
    let meanSquaredError = tf.losses.meanSquaredError(testLabels,testPredictions).dataSync()[0];
    let absoluteError= tf.losses.absoluteDifference(testLabels,testPredictions).dataSync()[0];
    //logger.info(`absolute error: ${absoluteError}`);
    //logger.info(`mean squared error: ${meanSquaredError}`);

    await PredictionModel.deleteMany({});
    await new PredictionModel({model:model.toJSON(null,true),
                                weights:model.getWeights().map(w => w.dataSync()),
                                meanSquaredError:isNaN(meanSquaredError)?undefined:meanSquaredError,
                                absoluteError:isNaN(absoluteError)?undefined:absoluteError,
                                minInputs:minInputs.dataSync(),
                                maxInputs:maxInputs.dataSync(),
                                minServed:minServed.dataSync(),
                                maxServed:maxServed.dataSync(),
                                dishNames:dishNames,
                                dishAvg:dishAvg}).save();
    logger.info('finished training prediction model');
    return model;
}

async function loadPredictionModel(){
    /*PredictionModel.schema.on('save',() => {
        try {
            logger.info('Prediction model change in Database detected, loading new model');
            loadPredictionModelFromDB();
        } catch(err) {
            logger.error('error loading prediction model errordetails:');
            logger.error(err);
        }
    });*/
    try {
        await loadPredictionModelFromDB();
    } catch(err) {
        if(err.message=='no prediction model found') {
            logger.info('no prediction model found in db');
            createPredictionModel().catch((err) => {
                if(err.type=='failed prediction model precondition'){
                    logger.warn(err.message);
                } else {
                    logger.error(err);
                }
            });
        } else {
            throw err;
        }
    }
}

async function loadPredictionModelFromDB() {
    let savedModel = await PredictionModel.findOne();
    if(!savedModel) throw {message:'no prediction model found'};
    let model = await tf.models.modelFromJSON(JSON.parse(savedModel.model));

    let loadedWeights=savedModel.weights.map(w => tf.tensor(Object.values(w)));
    loadedWeights.forEach((w,idx) => {
        loadedWeights[idx]=loadedWeights[idx].reshape(model.getWeights()[idx].shape);
    })
    model.setWeights(loadedWeights);
    predictionModel=model;
    minInputs=tf.tensor(Object.values(savedModel.minInputs[0]));
    maxInputs=tf.tensor(Object.values(savedModel.maxInputs[0]));
    minServed=tf.tensor(Object.values(savedModel.minServed[0]));
    maxServed=tf.tensor(Object.values(savedModel.maxServed[0]));
    dishNames=savedModel.dishNames;
    dishAvg=savedModel.dishAvg;
    return model;
}

function predict(entry){
    if(predictionModel==undefined)return undefined;
    entry.daysBefore=Math.ceil((new Date(entry.date).getTime()-new Date().getTime())/(1000*60*60*24));
    let input = normalize(entrysToFeature([entry]),minInputs,maxInputs);
    return denormalize(predictionModel.predict(input),minServed,maxServed).dataSync()[0];
}

module.exports={predict,loadPredictionModel,createPredictionModel};