import React, { useEffect, useMemo, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterTextIcon, StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import pattern from 'patternomaly'
import { Bar, Line, Pie } from "react-chartjs-2";
import restClient from '../../services/rest-client-service';
import Dialog from "@mui/material/Dialog";
import Select from 'react-select';
import { de } from 'date-fns/locale';
import {
  addDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from "date-fns";

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { Menu } from '@headlessui/react';
import DishTable from './DishTable';
import Button from '../misc/Button';
import { dateToStandardString, dateToIsoDate, convertDateFormat } from '../../services/date-service';
import Dropdown from '../misc/Dropdown';
import { SIGNUP_URL } from "../../data/clientConfiguration";
import {PencilSquareIcon} from '@heroicons/react/20/solid'
import CommentsDialog from './CommentsDialog';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ALLDISHES='all';
const chartColors={
  registered:'#0000ff',
  served:'#ffff00',
  wasted:'#ff0000',
  ordered:'#008100',
  other:'#777777'
}
const chartOptions = {responsive: true,plugins: {
  tooltip: {
    mode: 'index'
  },
},
interaction: {
  mode: 'nearest',
  axis: 'x',
  intersect: false
},scales:{}};

export default function Statistics() { 

  const customDateRanges = [{
    label: "Heute",
    range: () => ({
      startDate: new Date(),
      endDate: new Date()
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    }
  },
  {
    label: "Gestern",
    range: () => ({
      startDate: addDays(new Date(), -1),
      endDate:  addDays(new Date(), -1)
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    }
  },
  {
    label: "Diese Woche",
    range: () => ({
      startDate: startOfWeek(new Date(),{weekStartsOn:1}),
      endDate:  endOfWeek(new Date(),{weekStartsOn:1})
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    }
  },
  {
    label: "Letzte Woche",
    range: () => ({
      startDate: startOfWeek(addDays(new Date(), -7),{weekStartsOn:1}),
      endDate:  endOfWeek(addDays(new Date(), -7),{weekStartsOn:1})
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    }
  },
  {
    label: "Dieser Monat",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate:  endOfMonth(new Date())
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    }
  },
  {
    label: "Letzter Monat",
    range: () => ({
      startDate: startOfMonth(addMonths(new Date(), -1)),
      endDate:  endOfMonth(addMonths(new Date(), -1))
    }),
    isSelected(range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    }
  }];
  const [timeRange, setTimeRange] = useState([
    {startDate:dateToIsoDate(startOfMonth(new Date())),endDate:dateToIsoDate(endOfMonth(new Date())),key: 'selection'}
  ]);
  const [tableData, setTableData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [patchInput, setPatchInput] = useState({valueType:'served', newValue: 0, dish: {name:'', date:''}});
  const [allDishes, setAllDishes] = useState([]);
  const [currentDish, setCurrentDish] = useState({});
  const [statisticType, setStatisticType] = useState("Balkendiagramm");
  const [tooltipData, setTooltipData] = useState(false);
  const [open, setOpen] = useState(false);
  const [commentsDishName, setCommentsDishName] = useState("");

  useEffect(() => {
    restClient.get('/api/menuplans/statistics', {}, timeRange[0].startDate?
      {from:dateToStandardString(timeRange[0].startDate), to:dateToStandardString(timeRange[0].endDate)}:
      {from: dateToStandardString(new Date()), to: dateToStandardString(addDays(new Date(), 7))}).then(response=>{
        let formattedData = response.data;//response.data.map(({date, ordered, served, registered, wasted, name})=>{return {date, name,registered,ordered,served,wasted}});
        formattedData = formattedData.map((obj)=>{
          ["ordered","served","registered","wasted"].forEach((key)=>{
            if(!obj[key]){
              obj[key] = 0;
            }
          });
          return obj;
        });
        setTableData(formattedData);
        setCurrentDish((currentDish) => formattedData.map((dish)=>dish.name).includes(currentDish.name)?{...currentDish}:ALLDISHES)
    })
    .catch(response => {
      console.error('Getting chartData failed.', response);
    });
  }, [timeRange]);

  useEffect(() => {
    restClient.get('/api/menuplans/dishnames').then(response=>{
      setAllDishes(response.data);
    })
    .catch(response => {
      console.error('Getting all Dishes failed.', response);
    });
  }, []);

  useEffect(() => {
    const updateRatings = async () => {
      const needsRatingUpdate = tableData.some(dish => dish.avgRating === undefined || dish.numberOfRatings === undefined);
  
      if (needsRatingUpdate) {
        const dishNames = [...new Set(tableData.map(dish => dish.name))];
  
        try {
          const response = await restClient.post(`${SIGNUP_URL}/ratings-data`, { dishNames });
          const ratingsData = response.data;
  
          const updatedData = tableData.map(dish => {
            const ratingsInfo = ratingsData.find(rating => rating.dishName === dish.name);
            return {
              ...dish,
              avgRating: ratingsInfo ? ratingsInfo.averageRating : dish.avgRating,
              numberOfRatings: ratingsInfo ? ratingsInfo.totalRatings : dish.numberOfRatings,
            };
          });
  
          setTableData(updatedData);
        } catch (error) {
          console.error('Error loading ratings data: ', error);
        }
      }
    };
  
    if (tableData.length > 0) {
      updateRatings();
    }
  
  }, [tableData]);

  const handleMouseEnter = (dishName, rating) => {
    if (typeof rating === 'number') {
      setTooltipData({dishName: dishName, content: rating.toFixed(2)});
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipData(false)
  };

  const formattedTableData = useMemo(function formatTableData() {
    let formattedData = tableData.reduce((acc, cur, i) => {
      const item = i > 0 && acc.find(({name}) => name === cur.name)
      if (item) {
        item.ordered += cur.ordered;
        item.served += cur.served;
        item.registered += cur.registered;
        item.wasted += cur.wasted;
      }
      else acc.push({name: cur.name, ordered: cur.ordered, served: cur.served, registered: cur.registered, wasted: cur.wasted }); 
      return acc;
    }, []);
    return formattedData;
  }, [tableData]);

  const chartData = useMemo(() => {
    function refreshStatistic() {
      let dates = getDates(timeRange[0].startDate, timeRange[0].endDate);
  
      let currentDishDates = currentDishEntries().map((dish)=>{return dish.date;});
      let minDate = Math.min(...currentDishDates.map((date)=> new Date(date).getTime()));
      let maxDate =Math.max(...currentDishDates.map((date)=> new Date(date).getTime()));
  
      dates = dates.filter((date)=>{
        return minDate <= date.getTime()&&maxDate >= date.getTime();
      });
  
      let lineLabels = [];
      let lineDatasets = [];
  
      dates.forEach((element, idx) => {
        lineLabels[idx] = currentDishDates.includes(dateToStandardString(element))?convertDateFormat(element):"";
      });
  
      lineDatasets[0] = makeLine('Weggeworfen', chartColors.wasted, 'wasted', dates);
      lineDatasets[1] = makeLine('Bestellt', chartColors.ordered, 'ordered', dates);
      lineDatasets[2] = makeLine('Angemeldet', chartColors.registered, 'registered', dates);
      lineDatasets[3] = makeLine('Ausgegeben', chartColors.served, 'served', dates);
      lineDatasets[4] = makeLine('Ausgegeben (Vorhersage)',chartColors.served,'pred_served',dates);
      lineDatasets[4].backgroundColor='white';
      lineDatasets[4].pointBackgroundColor=chartColors.served;
      lineDatasets[4].borderDash=[6,6];
      if(lineDatasets[3].data.length>0) {
        //connect Ausgegeben and Ausgegeben (Vorhersage)
        lineDatasets[4].data[lineDatasets[3].data.length-1]=lineDatasets[3].data[lineDatasets[3].data.length-1];
        let pointRadius=lineDatasets[4].data.map((_point,idx) => idx===lineDatasets[3].data.length-1?0:3);
        lineDatasets[4].pointRadius=pointRadius;
        lineDatasets[4].pointHitRadius=pointRadius;
      }
      return {timeLineChart:{labels:lineLabels, datasets:lineDatasets}, totalPieChart:makePie(), barChart:{labels:lineLabels,datasets:makeBarChartData(dates)},cumulativeLineChart:{labels:lineLabels,datasets:makeCumulativeLineData(dates)}};
    }

    function makeCumulativeLineData(dates) {
      let dataSets=makeBarChartData(dates);
      dataSets.forEach(dataSet => {
        dataSet.spanGaps=true;
        dataSet.fill='stack';
      });
      dataSets[0].backgroundColor=chartColors.registered+'cc';
      dataSets[1].backgroundColor=chartColors.served+'cc';
      dataSets[2].backgroundColor=pattern.draw('diagonal', chartColors.served+'cc', undefined,40)
      dataSets[3].backgroundColor=chartColors.wasted+'cc';
      dataSets[4].backgroundColor=chartColors.other+'cc';
      if(dataSets[1].data.length>0&&dataSets[2].data.length>0) {
        //connect Ausgegeben and Ausgegeben (Vorhersage)
        dataSets[2].data[dataSets[1].data.length-1]=0;
        let pointRadius=dataSets[2].data.map((_point,idx) => idx===dataSets[1].data.length-1?0:3);
        dataSets[2].pointRadius=pointRadius;
        dataSets[2].pointHitRadius=pointRadius;
      } 
      return dataSets;
    }

    function makeBarChartData(dates) {
      let dataSets=[
        {label:'Angemeldet Ausgegeben',data:[],backgroundColor:chartColors.registered,borderColor:chartColors.registered},
        {label:'Unangemeldet Ausgegeben',data:[],backgroundColor:chartColors.served,borderColor:chartColors.served},
        {label:"Ausgegeben (Vorhersage)",data:[],backgroundColor:pattern.draw('diagonal', chartColors.served, undefined,40),borderColor:chartColors.served,borderDash:[6,6]},
        {label:'Weggeworfen',data:[],backgroundColor:chartColors.wasted,borderColor:chartColors.wasted},
        {label:'Anderes',data:[],backgroundColor:chartColors.other,borderColor:chartColors.other}
      ];      
      dates.forEach((element) => {
        let dish = currentDishEntries().find((dish)=>{return dish.date===dateToStandardString(element)});
        if(!dish) {
          dataSets[0].data.push(NaN);
          dataSets[1].data.push(NaN);
          dataSets[2].data.push(NaN);
          dataSets[3].data.push(NaN);
          dataSets[4].data.push(NaN);
        } else {
          let registered = dish.registered??0;
          dataSets[0].data.push(registered);
          let unRegistered;
          if(!dish.served&&dish.pred_served) {
            unRegistered=dish.pred_served?Math.max(dish.pred_served-registered,0):0;
            dataSets[2].data.push(unRegistered);
          } else {
            unRegistered=dish.served?Math.max(dish.served-registered,0):0;
            dataSets[1].data.push(unRegistered);
            dataSets[2].data.push(NaN);
          }
          let wasted=dish.wasted??0;
          let ordered=dish.ordered??0;
          dataSets[3].data.push(wasted);
          dataSets[4].data.push(Math.max(ordered-registered-unRegistered-wasted,0));
        }  
        
      });
      for(let dataset of dataSets) {
        while(dataset.data.length>0 && !dataset.data[dataset.data.length-1]){
          dataset.data.pop();
        }
      }
      return dataSets;
    }
  
    function makeLine(label, color, attribute, dates) {
      let dataset = {};
  
      dataset.label = label;
      dataset.data = [];
      dataset.backgroundColor = color;
      dataset.borderColor = color;
  
      let dish;
      dates.forEach((element, idx) => {
        dish = currentDishEntries().find((dish)=>{return dish.date===dateToStandardString(element)});
        dataset.data[idx] = dish?dish[attribute]:NaN;
      });
      while(dataset.data.length>0 && !dataset.data[dataset.data.length-1]){
        dataset.data.pop();
      }

      dataset.spanGaps=true;
      dataset.fill=false;
  
      return dataset;
    }
  
    function makePie() {
      let pieLabels = ['Angemeldet Ausgegeben', 'Unangemeldet Ausgegeben', 'Weggeworfen', 'Anderes'];
      let dataset = {};
  
      dataset.label = '';
      dataset.backgroundColor = [chartColors.registered,chartColors.served,chartColors.wasted,chartColors.other];
      dataset.borderColor =  ['white'];
      let {registered, ordered, served,wasted}=tableData.filter(entry => entry.served&&entry.ordered&&(currentDish===ALLDISHES||entry.name===currentDish.name)).reduce((total,entry)=>{
        ['registered', 'ordered', 'served','wasted'].forEach((attr)=>total[attr]=(total[attr]??0)+(entry[attr]??0));
        return total;
      },{registered:0,ordered:0,wasted:0,served:0});
      let unRegistered=served-registered;
  
      /*let dish = currentDish===ALLDISHES?formattedTableData.reduce((total,entry)=>{
        attributes.forEach((attr)=>total[attr]=(total[attr]??0)+entry[attr]);
        return total
      },{}):formattedTableData.find((dish)=>{return dish.name===currentDish.name});*/
      dataset.data = [registered,unRegistered,wasted,ordered-registered-unRegistered-wasted];
  
  
      return {labels:pieLabels, datasets:[dataset]};
    }

    const currentDishEntries = function () {
      return currentDish===ALLDISHES?
      tableData.reduce((arr,dish)=>{
        let idx=arr.findIndex((day)=>day.date===dish.date);
        if(idx===-1) {
          arr.push(dish);
        } else {
          arr[idx]={...arr[idx]};
          Object.keys(dish).forEach(key => {
            if(key!=="name"&&key!=="date"){
              arr[idx][key]=(arr[idx][key])+(dish[key]);
            }
          });
        }
        return arr;
      },[]):
      tableData.filter((dish)=>
        dish.name === currentDish.name
      )
    }

    return refreshStatistic();
  }, [currentDish, tableData, timeRange]);

  const columns = useMemo(
    () => {
      const aggregateSum = (key) => "Summe = " + tableData.reduce((acc, row) => acc + row[key], 0);

      function onEditClick(cell) {
        let selectedDish = tableData.find((dish)=>{return dish.name===cell.row.original.name});
        setPatchInput({...patchInput, dish: {name: selectedDish['name'],date: ""}, newValue: "0"});  
        setDialogOpen(true);
      }

      const onCommentClick = (cell) => {
        let selectedDish = tableData.find((dish)=>{return dish.name===cell.row.original.name});
        setCommentsDishName(selectedDish['name']);
        setOpen(true);
      };

    return (
      [
      {
        header: 'Name',
        accessorKey: "name",
        accessorFn: row => row.name,
        enableColumnFilter: false,
      },

      {
        header: 'Angemeldet',
        // footer: props => props.column.id,
        footer: props => aggregateSum("registered"),
        accessorKey: "registered",
        accessorFn: row => row.registered,
        enableColumnFilter: false,
      },

      {
        header: 'Bestellt',
        footer: props => aggregateSum("ordered"),
        accessorKey: "ordered",
        accessorFn: row => row.ordered,
        enableColumnFilter: false,
      },

      {
        header: 'Ausgegeben',
        footer: props => aggregateSum("served"),
        accessorKey: "served",
        accessorFn: row => row.served,
        enableColumnFilter: false,
      },

      {
        header: 'Weggeworfen',
        footer: props => aggregateSum("wasted"),
        accessorKey: "wasted",
        accessorFn: row => row.wasted,
        enableColumnFilter: false,
        aggregate: "sum"
      },

      {
        header: 'Bewertung',
        cell: ({ row }) => {
          const dishName = row.original.name;
          const avgRating = tableData.find((dish) => dish.name === dishName).avgRating;
          const numberOfRatings = tableData.find((dish) => dish.name === dishName).numberOfRatings;
      
          return (
            <div className="relative flex flex-row items-center">
              <div
                className="flex flex-row"
                onMouseEnter={() => handleMouseEnter(dishName, avgRating)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.round(avgRating) ? (
                    <SolidStarIcon className="h-5 w-5 text-yellow-500" key={star} />
                  ) : (
                    <OutlineStarIcon className="h-5 w-5 text-yellow-500" key={star} />
                  )
                ))}
              </div>
              <div className="ml-3 flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {numberOfRatings}
              </div>
              {tooltipData?.dishName === dishName && (
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md">
                  {tooltipData?.content}
                </div>
              )}
            </div>
          );
        },
      },
      
      {
        header: 'Kommentare',
        cell: (cell) => {
          return (
            <div className='m-auto w-fit' onClick={(event) => {event.stopPropagation()}}>
              <Button  children={<ChatBubbleBottomCenterTextIcon className="w-5 h-5" />} onClick={()=>{onCommentClick(cell)}} />
            </div>
          );
        },
      },

      {
        header: 'Bearbeiten',
        cell: (cell) => {
          return (
            <div className='m-auto w-fit' onClick={(event)=>{event.stopPropagation()}}>
              <Button children={<PencilSquareIcon className="w-5 h-5" />} onClick={()=>{onEditClick(cell)}} />
            </div>
          );
        },
      },
      
    ])},
    [tableData, patchInput, tooltipData]
  );

  let opts = allDishes.filter((obj)=>{return obj.name===patchInput.dish.name}).map((obj)=>{return {label: obj.date, value: obj.date}});
  // opts = opts.map((obj)=>{return obj.label}).sort();
  //opts = opts.map((option)=>{return {label: option, value: option}});

  function handleRowClicked(row) {
    let selectedDish = tableData.find((dish)=>{return dish.name===row.name});
    setCurrentDish(selectedDish); 
  }

  function handleFooterClicked() {
    setCurrentDish(ALLDISHES);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleValueChange(event) {
    setPatchInput({...patchInput, [event.target.name]:event.target.value});
  }

  function handleTypeValueChange(valueType) {
    let found = tableData.find((dish)=>{return patchInput.dish.date===dish.date&&dish.name===patchInput.dish.name});
    setPatchInput({...patchInput, valueType, newValue: found?`${found[valueType]}`:"0"});
  }

  function handleDateSelectionChange(selection) {
    if(selection !== undefined) {
      let dish = allDishes.filter((obj)=>{return obj.name===patchInput.dish.name && obj.date===selection.label}).map((obj)=>{return {name: obj.name, date: obj.date}});
      if(dish) {
        let found = tableData.find((dish)=>{return selection.label===dish.date&&dish.name===patchInput.dish.name});

        setPatchInput({...patchInput, dish: dish[0], newValue: found?`${found[patchInput.valueType]}`:"0"});
      }
    }
  }

  function getDates(start, end) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
  };

  function onChangeButtonClicked(event) {
    if(patchInput.valueType && patchInput.newValue && patchInput.dish) {
      restClient.patch('/api/menuplans/statistics',
        {name:patchInput.dish.name, date:patchInput.dish.date, [patchInput.valueType]:patchInput.newValue})
      .then((response)=>{
        setDialogOpen(false);
        setTimeRange([...timeRange]);
      })
      .catch((response)=>{
        console.error('Updating value failed.', response);
      });
    }
  }

  function convertValueType(valueType) {
    let type;

    switch(valueType) {
      case "wasted":
        type = "Weggeworfen";
        break;
      case "ordered":
        type = "Bestellt";
        break;
      case "served":
        type = "Ausgegeben";
        break;
      default:
        type = "";
        break;
    }
    
    return type;
  }

  function getDialogContent() {
    return (
      <div className='p-[3%] w-[35vw] overflow-hidden h-[25.4rem]'>
        <h1 className='mb-3 text-lg'>{patchInput.dish.name}</h1>
        <Select
          id={"basic-typeahead-single"}
          placeholder='Datum auswählen'
          onChange={handleDateSelectionChange}
          options={opts}
        /> 
        <div className='flex mb-[6%] mt-[6%]'>
          <Menu as="div">
            <Dropdown options={
              [{value:"ordered",content:"Bestellt"},{value:"served",content:"Ausgegeben"},{value:"wasted",content:"Weggeworfen"}]
              } selectedOption={convertValueType(patchInput.valueType)} onChange={handleTypeValueChange} />
          </Menu>
          <input className='ml-2 border border-gray-300 rounded p-1' name='newValue' type='number' onChange={handleValueChange} value={patchInput.newValue}/>
        </div> 
        <Button className='ml-0' onClick={onChangeButtonClicked}>Speichern</Button>
      </div>
    )
  }

  function onStatisticTypeChange(type) {
    setStatisticType(type);
  }

  function getStatisticTypes() {
    return [{
      value: "Liniendiagramm",
      content: "Liniendiagramm"
    }, {
      value: "Liniendiagramm (kummulativ)",
      content: "Liniendiagramm (kummulativ)"
    }, {
      value: "Balkendiagramm",
      content: "Balkendiagramm"
    }, {
      value: "Kreisdiagramm",
      content: "Kreisdiagramm"
    }];
  }

  function getStatisticElement() {
    let element;

    switch(statisticType) {
      case "Liniendiagramm":
        element = <Line data={chartData.timeLineChart?chartData.timeLineChart:{labels:[], datasets:[{data:[]}]}} options={{...chartOptions,
          plugins: {...chartOptions.plugins,
            title: {
              display: true,
              text: 'Absolute Werte'
            }
          }}} />;
        break;
      case "Liniendiagramm (kummulativ)":
        element = <Line data={chartData.cumulativeLineChart?chartData.cumulativeLineChart:{labels:[], datasets:[{data:[]}]}} type="area" options={{...chartOptions,
          plugins: {...chartOptions.plugins,
            title: {
              display: true,
              text: 'Anteil an den Bestellten Gerichten'
            }
          },
          scales: {
            y: {
              stacked: true,
            }
          }}} />;
        break;
      case "Balkendiagramm":
        element = <Bar data={chartData.barChart?chartData.barChart:{labels:[], datasets:[{data:[]}]}} options={{...chartOptions,
          plugins: {...chartOptions.plugins,
            title: {
                display: true,
                text: 'Anteil an den Bestellten Gerichten',            
            }
          },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
          }}}/>;
        break;
      case "Kreisdiagramm":
        element = <Pie data={chartData.totalPieChart?chartData.totalPieChart:{labels:[], datasets:[{data:[]}]}} options={{...chartOptions,
          plugins: {
             title: {
                display: true,
                text: 'Anteil an den Bestellten Gerichten',            
             }
          }
       }} />;
        break;
      default:
        element = <p className='m-10 text-xl text-red-500'>Kein Diagramm ausgewählt</p>;
    }

    return element;
  }

  return (
    
    <div className='h-[100vh] overflow-y-auto'>
      <CommentsDialog open={open} setOpen={setOpen} commentsDishName={commentsDishName} />
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth='35vw'>
        {getDialogContent()}
      </Dialog>
      <div className='flex'>
      <div className='grow h-fit mx-0 basis-0 min-w-[12rem]'>
        <Menu as="div" className='float-left relative inline-block text-left w-fit m-3'>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {convertDateFormat(timeRange[0].startDate)!==convertDateFormat(timeRange[0].endDate)?convertDateFormat(timeRange[0].startDate) + ' - ' + convertDateFormat(timeRange[0].endDate):convertDateFormat(timeRange[0].startDate)}
          </Menu.Button>

          <Menu.Items className="absolute z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              <DateRangePicker
                onChange={item => setTimeRange([{...item.selection,startDate:dateToIsoDate(item.selection.startDate),endDate:dateToIsoDate(item.selection.endDate)}])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={true}
                months={2}
                ranges={timeRange}
                direction="horizontal"
                preventSnapRefocus={true}
                calendarFocus="backwards"
                locale={de}
                staticRanges={customDateRanges}
                inputRanges={[]}
              />
            </Menu.Item>
          </Menu.Items>
        </Menu>
        </div>
        <h1 className='mt-2 mx-0 text-3xl max-w-[54rem] text-center'>{currentDish.name??"Alle Gerichte"}</h1>
        <div className='flex-grow basis-0 min-w-[12rem]'>
          <Menu as="div" className='float-right relative inline-block m-3 mr-5'>
            <Dropdown options={getStatisticTypes()} selectedOption={statisticType} onChange={onStatisticTypeChange} />
          </Menu>
        </div>
      </div>
      <div className='w-full max-h-[40rem] flex'>
        <div className='grow basis-0' />
        {getStatisticElement()}
        <div className='grow basis-0' />
      </div>
      <div>
        {formattedTableData && <DishTable columns={columns} data={formattedTableData} onRowClick={handleRowClicked} onFooterClick={handleFooterClicked} onMouseLeave={() => handleMouseLeave()}/>}


      </div>
    </div>
  )
}
