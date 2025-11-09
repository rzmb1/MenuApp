import React, { useEffect, useState } from "react";
import MenuPlanDay from './MenuPlanDay';
import { MenuplanDocument } from "./MenuplanDay_Document";
import { dateToStandardString } from '../../services/date-service';
import { DAYS, MONTHS } from '../../data/clientConfiguration';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Dialog from "@mui/material/Dialog";
import QRCode from "qrcode";
import Button from "../misc/Button";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import restClient from "../../services/rest-client-service";
import { browserName } from 'react-device-detect';

export const MenuTable = React.forwardRef(({menuPlan,onDayClicked,onDishClicked,onDeleteClicked,onAddClicked, disabled, onDisableDayClicked,menuFilter,printMode}, ref) => {
    function incDate(date, days) {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate()+days);
        return dateToStandardString(newDate);
    }

    function getDateString(dateAsStr) {
        let date = new Date(dateAsStr);      
        return `${date.getDate()}. ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    async function handlePrintButton(day, date) {
        setDayToPrint(day);
        setDateStrToPrint(getDateString(date));
        await setImagesToShow(day);
        setPrintDialogOpen(true);
    }

    async function setImagesToShow(day) {
        let getImagePromises = [];
        for (let dish of menuPlan?.days?.[day]) {
            getImagePromises.push(restClient.get(`/api/images/${dish.image}`));
        }
        let imagePromiseResults = await Promise.all(getImagePromises);
        let imagesToShow = imagePromiseResults.map(ipr => ipr.data);
        setImagesToPrint(imagesToShow);
    }

    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [dayToPrint, setDayToPrint] = useState('');
    const [dateStrToPrint, setDateStrToPrint] = useState('');
    const [imagesToPrint, setImagesToPrint] = useState([]);
    const [qrcodeImage, setQrcodeImage] = useState('');
    
    useEffect(() => {
        QRCode.toDataURL(window.location.href, {type: "png"})
        .then(img => setQrcodeImage(img));
    }, []);
    
    return (
        <div ref={ref} className={!printMode ? 'min-h-screen h-[90vh]' : (browserName === 'Chrome' || browserName === 'Edge') ? 'h-[80vh]' : 'h-[90vh]'}>
            <div className={!printMode ? 'flex min-h-screen h-[90vh]' : (browserName === 'Chrome' || browserName === 'Edge') ? 'flex h-[80vh]' :'flex h-[90vh]'}>
                {DAYS.map((day,idx) =>
                    <MenuPlanDay key={day} 
                        day={day}
                        date={menuPlan?.startDate?incDate(menuPlan.startDate,idx):''}
                        onDayClicked={onDayClicked} 
                        onDishClicked={onDishClicked} 
                        onDeleteClicked={onDeleteClicked} 
                        onAddClicked={onAddClicked} 
                        dishes={menuPlan?.days?.[day]} 
                        onDisableDayClicked={onDisableDayClicked}
                        disabled={disabled[day]}
                        menuFilter={menuFilter}
                        handlePrintButton={handlePrintButton}
                        printMode={printMode}
                    />
                )}
                
                <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} fullWidth>
                    <PDFViewer className="h-screen">
                        <MenuplanDocument menuPlan={menuPlan} dayToPrint={dayToPrint} imagesToPrint={imagesToPrint} dateStrToPrint={dateStrToPrint}/>
                    </PDFViewer>
                    <div className="flow-root mx-3">
                        <div className="float-left">
                            <Button onClick={() => setPrintDialogOpen(false)}>Zurück</Button>
                        </div>
                        <div className="float-right">
                            <Button className="flex flex-row">
                                <PDFDownloadLink document={
                                        <MenuplanDocument menuPlan={menuPlan} dayToPrint={dayToPrint} imagesToPrint={imagesToPrint} dateStrToPrint={dateStrToPrint}/>
                                    } fileName={`Speiseplan am ${dayToPrint} dem ${dateStrToPrint}.pdf`}>
                                        {({ loading }) => (loading ? 'Lade Dokument...' : 'Herunterladen')}
                                </PDFDownloadLink>
                                <ArrowDownTrayIcon className="w-7"/>
                            </Button>
                        </div>
                       
                    </div>
                </Dialog>
            </div>
            {printMode === true && <div className="flex flex-row justify-center fixed left-1/2 -translate-x-1/2 bottom-0">
                <div className="flex justify-center items-center w-10/12">
                    Durch Ihre Anmeldung können Sie dazu beitragen, dass weniger Essen weggeworfen wird!
                    Scannen Sie dazu folgenden QR-Code:
                </div>
                <div className="flex justify-center w-2/12">
                    <img
                        src={qrcodeImage}
                        alt="QRCode"
                        className="object-cover object-center"
                    />
                </div>
            </div>}
        </div>
    );
});
