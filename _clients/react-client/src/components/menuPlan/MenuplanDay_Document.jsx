import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { COURSES, MENUS, MENU_COLORS_PLAIN } from "../../data/clientConfiguration";
import QRCode from "qrcode";
import { useState, useEffect } from 'react';
import { createTw } from "react-pdf-tailwind";

export const MenuplanDocument = ({ menuPlan, dayToPrint, imagesToPrint, dateStrToPrint }) => {
    
    useEffect(() => {
        QRCode.toDataURL(window.location.href, {type: "png"})
        .then(img => setQrcodeImage(img));
    }, []);

    const [qrcodeImage, setQrcodeImage] = useState('');
    
    const tw = createTw({
        theme: {
          fontFamily: {
            sans: ["Comic Sans"],
          },
          extend: {
            colors: {
              custom: "#bada55",
            },
          },
        },
    });

    const styles = StyleSheet.create({
        heading: {
            marginBottom: 2,
            fontSize: 26,
            fontWeight: 800, 
            letterSpacing: -0.025, 
            lineHeight: 1, 
            color: "#111827",
            textAlign: "center" 
        },
        course: {
            marginBottom: 2,
            fontSize: 25,
            fontWeight: 800, 
            letterSpacing: -0.025, 
            lineHeight: 1, 
            color: "#111827",
            textAlign: "center" 
        },
        dishText: {
            fontSize: 17,
            maxHeight: 30,
            maxWidth: 175,
            padding: 0,
            textAlign: 'center'
        },
        image: {
            minWidth: 100,
            maxWidth: 175,
        },
        tags: {
            maxWidth: 175,
        },
        tag: {
            borderRadius: 20,
            display: "inline",
            marginHorizontal: 3,
            paddingVertical: 3,
            paddingHorizontal: 3,
            fontSize: 11,
            lineHeight: 1.25,
            color: "#1E40AF",
            backgroundColor: "#DBEAFE",
        },
        qrcode: {
            display: "block",
            marginHorizontal: "auto",
            width: 100
        }
      });
  
    return (
        <Document>
            <Page size="A4" >
                <View key="main-view"> 
                <Text style={styles.heading}>Speiseplan am {dayToPrint} ({dateStrToPrint})</Text>
                {
                    COURSES.map((course, idx) => <View key={`course-${idx}`} style={tw('my-2')}>
                    {
                        <Text key={`heading-${idx}`} style={styles.course}>{`${course}n`}</Text>
                    }
                    {
                        <View key={`inner-course-${idx}`} style={tw('flex flex-row justify-center items-start')}>
                            {
                                menuPlan?.days?.[dayToPrint]?.filter(d => d?.tags?.includes(course)).map((dish, idx) => {
                                    return <View key={idx} style={tw('mx-2 justify-center items-center justify-evenly')}> 
                                        <Text key={idx} style={[tw('text-base text-center'), styles.dishText]}>{dish.name}</Text> 
                                        <Image key={idx} style={[tw('mb-1 rounded-lg'), styles.image]} src={imagesToPrint?.find(img => img._id === dish.image)?.image}/>
                                        <View key={`tags-${idx}`} style={[tw('flex flex-row flex-wrap justify-center items-center'), styles.tags]}>
                                        {
                                            dish?.tags?.find(tag => MENUS.includes(tag)) &&
                                            <Text key={`menu-${idx}`} style={[tw('mx-1 my-0.5'), styles.tag, 
                                            { color: 'white', backgroundColor: MENU_COLORS_PLAIN[dish?.tags?.find(tag => MENUS.includes(tag))] }
                                            ]}>
                                                {dish?.tags?.find(tag => MENUS.includes(tag))}
                                            </Text>
                                        }
                                        
                                        {
                                            dish?.tags?.filter(tag => 
                                                !COURSES.includes(tag) && !MENUS.includes(tag)
                                            ).map((tag, idx) => 
                                                <Text key={`tag-${idx}`} style={[tw('mx-1 my-0.5'), styles.tag]}>{tag}</Text>
                                            )
                                        }
                                        </View>
                                    </View>
                                })
                            }
                        </View>
                    }
                    </View>) 
                }
                <Image style={styles.qrcode} src={qrcodeImage}/>
                
                </View>
            </Page>
        </Document>
    );
};
