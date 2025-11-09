import React, { useEffect, useRef, useState } from "react";
import TopBar from "../menuPlan/MenuTopBar_Mobile";
import restClient from "../../services/rest-client-service";
import Creatable from "react-select/creatable";
import Select from "react-select";
import notifyer from "../../services/notifyer-service";
import MenuToggle from "./MenuToggle";
import { PhotoIcon } from "@heroicons/react/20/solid";
import Button from "../misc/Button";

export default function DishCreation({
  menuPlan,
  setMenuPlan,
  setCurrPage,
  currDay,
  currMeal,
}) {
  const [currentTags, setCurrentTags] = useState([]);
  const [mandatoryData, setMandatoryData] = useState({
    Title: "",
    MenuA: "",
    MenuB: "",
    MenuC: "",
    Image: {},
  });
  const [allDishes, setAllDishes] = useState();
  const [allImages, setAllImages] = useState();
  const [dishFilter, setDishFilter] = useState([]);
  const dishImageRef = useRef(null);

  useEffect(() => {
    let newMandatoryData = {};
    let newTags = [];

    if (currMeal.name) {
      newTags = initializeTags();
      newMandatoryData = initializeMandatory();

      setCurrentTags(newTags);
    }

    restClient
      .get("/api/images")
      .then((response) => {
        if (currMeal.image) {
          setMandatoryData({
            ...newMandatoryData,
            Image: {
              _id: currMeal.image,
              image: response.data.find((img) => img._id === currMeal.image)
                ?.image,
            },
          });
        } else if (currMeal.name) setMandatoryData(newMandatoryData);

        setAllImages(response.data);
      })
      .catch((response) => {
        console.error("Getting image failed.", response);
        setMandatoryData(newMandatoryData);
      });

    restClient
      .get("/api/menuplans/dishes")
      .then((response) => {
        setAllDishes(response.data);
      })
      .catch((response) =>
        console.error("Getting Tag suggestions failed.", response)
      );

    // This Comment disables Warnings:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initializeTags() {
    let tagState = [];

    tagState = [...currMeal.tags];

    for (let item of currMeal.tags) {
      if (item === "Menü A" || item === "Menü B" || item === "Menü C") {
        tagState.splice(tagState.indexOf(item), 1);
      }
    }

    return tagState.filter((item) => item);
  }

  function initializeMandatory() {
    let initialMandatoryDataValue = {
      Title: "",
      MenuA: "",
      MenuB: "",
      MenuC: "",
      Image: {},
    };

    initialMandatoryDataValue.Title = currMeal.name;

    for (let item of currMeal.tags) {
      if (item === "Menü A" || item === "Menü B" || item === "Menü C") {
        initialMandatoryDataValue["Menu" + item.slice(-1)] = item;
      }
    }

    return initialMandatoryDataValue;
  }

  function onTagChange(tags) {
    setCurrentTags(tags.map((tag) => tag.label));
  }

  function onDishFilterChange(selected) {
    if (selected.length !== 0 && selected.length !== undefined) {
      setDishFilter(
        selected.map((item) => {
          return item.value;
        })
      );
    } else {
      setDishFilter([]);
    }
  }

  function onFormControlChange(event) {
    let newData = { ...mandatoryData };

    newData[event.target.name] = event.target.value;

    setMandatoryData(newData);
  }

  function onFormControlImageChange(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let newData = { ...mandatoryData };
      restClient
        .post("/api/images", { image: e.target.result })
        .then((response) => {
          newData.Image = { _id: response.data._id, image: e.target.result };
          setMandatoryData(newData);
        })
        .catch((response) => console.error("Saving failed.", response));
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  function onMenuToggleButtonClicked(name, checked) {
    setMandatoryData({
      ...mandatoryData,
      ["Menu" + name]: checked ? "Menü " + name : "",
    });
  }

  function getTagsAndNames() {
    let allTags = getAllTags();
    let allNames = [];

    if (allDishes) {
      allNames = allDishes.map((dish) => dish.name);

      allNames = allNames.map((option) => {
        return { label: option, value: option };
      });

      allNames = allNames.filter((val) => val.label);
      allNames = allNames.filter((val, index) => {
        return !allNames.map((val) => val.label).includes(val.label, index + 1);
      });
    }

    return [...allNames, ...allTags];
  }

  function getAllTags() {
    let opts = [];
    let currentOptions = currentTags.map((option) => {
      return { label: option, value: option };
    });
    let standardOptions = [
      { value: "Vorspeise", label: "Vorspeise" },
      { value: "Hauptspeise", label: "Hauptspeise" },
      { value: "Nachspeise", label: "Nachspeise" },
      {
        value: "A (Glutenhaltiges Getreide)",
        label: "A (Glutenhaltiges Getreide)",
      },
      { value: "B (Krebstiere)", label: "B (Krebstiere)" },
      { value: "C (Eier)", label: "C (Eier)" },
      { value: "D (Fische)", label: "D (Fische)" },
      { value: "E (Erdnüsse)", label: "E (Erdnüsse)" },
      { value: "F (Sojabohnen)", label: "F (Sojabohnen)" },
      { value: "G (Milch)", label: "G (Milch)" },
      { value: "H (Schalenfrüchte)", label: "H (Schalenfrüchte)" },
      { value: "L (Sellerie)", label: "L (Sellerie)" },
      { value: "M (Senf)", label: "M (Senf)" },
      { value: "N (Sesamsamen)", label: "N (Sesamsamen)" },
      {
        value: "O (Schwefeldioxid und Sulphite)",
        label: "O (Schwefeldioxid und Sulphite)",
      },
      { value: "P (Lupinen)", label: "P (Lupinen)" },
      { value: "R (Weichtiere)", label: "R (Weichtiere)" },

      { value: "Salat", label: "Salat" },
    ];

    allDishes
      ?.map((dish, index) => {
        return dish.tags;
      })
      .forEach((element) => {
        opts = [...opts, ...element];
      });

    for (let itm of opts) {
      if (itm === "Menü A" || itm === "Menü B" || itm === "Menü C") {
        opts.splice(opts.indexOf(itm), 1);
      }
    }

    opts = opts.map((option) => {
      return { label: option, value: option };
    });
    opts = [...standardOptions, ...opts, ...currentOptions];

    opts = opts.filter((val) => val.label);
    opts = opts.filter((val, index) => {
      return !opts.map((val) => val.label).includes(val.label, index + 1);
    });

    return opts;
  }

  function onSaveClick(_event) {
    if (!mandatoryData.Title) {
      notifyer.error("Ein Gericht muss einen Titel haben!");
    } else if (
      !(
        currentTags.includes("Vorspeise") ||
        currentTags.includes("Hauptspeise") ||
        currentTags.includes("Nachspeise")
      )
    ) {
      notifyer.error(
        "Jedes Gericht benötigt mindestens einen Gang in den Tags."
      );
    } else {
      let tags = [...currentTags];

      tags.push(mandatoryData.MenuA);
      tags.push(mandatoryData.MenuB);
      tags.push(mandatoryData.MenuC);

      tags = tags.filter((item) => item);
      tags = tags.filter((item, idx) => {
        return !tags.includes(item, idx + 1);
      });

      let dish = {
        name: mandatoryData.Title,
        image: mandatoryData.Image._id,
        tags: tags,
      };

      let newMenuPlan = {
        ...menuPlan,
        days: {
          ...menuPlan.days,
          [currDay]: menuPlan.days[currDay]
            ? [
                ...menuPlan.days[currDay].filter(
                  (item) => item.name !== currMeal.name
                ),
                dish,
              ]
            : [dish],
        },
      };

      setMenuPlan(newMenuPlan);
      setCurrPage("overview");
    }
  }

  function handleBackClicked() {
    setCurrPage("overview");
  }

  function onDishSelected(name) {
    let selectedDish = allDishes.find((item) => item.name === name);

    let newMandatoryData = {
      Title: selectedDish.name,
      MenuA: "",
      MenuB: "",
      MenuC: "",
      Image: {
        _id: selectedDish.image,
        image: allImages?.find((img) => img._id === selectedDish.image).image,
      },
    };
    let newCurrentTags = selectedDish.tags;

    for (let item of selectedDish.tags) {
      if (item === "Menü A" || item === "Menü B" || item === "Menü C") {
        newCurrentTags.splice(newCurrentTags.indexOf(item), 1);
      }
    }

    newCurrentTags = newCurrentTags.filter((item) => item); // Filter out falsy values

    setMandatoryData(newMandatoryData);
    setCurrentTags(newCurrentTags);
  }

  function filterDishList(item) {
    let found = true;

    dishFilter.forEach((filter) => {
      if (!(item.name === filter || item.tags.includes(filter))) {
        found = false;
      }
    });

    return found;
  }

  return (
    <div className="h-full">
      <div className="h-[10%]">
        <TopBar
          handleBackClicked={handleBackClicked}
          text={currMeal.name ? "Gericht bearbeiten" : "Gericht erstellen"}
        ></TopBar>
      </div>
      <div className="relative h-[90%]">
        <div className="flex">
          <div className="w-3/5 m-4">
            <div className="flex w-full">
              <div className="pt-2 mr-2">
                <div
                  className="h-40 w-40 aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-200 aspect-none"
                  onClick={() => dishImageRef.current.click()}
                >
                  {mandatoryData.Image.image ? (
                    <img
                      src={mandatoryData.Image.image}
                      alt="Symbolbild"
                      className="h-full w-full object-cover object-center hover:scale-110"
                    />
                  ) : (
                    <PhotoIcon className="w-1/2 h-full mx-auto object-center object-cover hover:scale-125 text-slate-600" />
                  )}
                </div>
                <input
                  className="hidden"
                  name="Image"
                  type="file"
                  accept="image/*"
                  ref={dishImageRef}
                  onChange={onFormControlImageChange}
                />
              </div>

              <div className="h-fit flex-row mt-4 pt-2 w-full">
                <input
                  className="text-2xl focus:outline-none bg-transparent w-full"
                  name="Title"
                  type="text"
                  placeholder="Name bearbeiten ..."
                  value={mandatoryData.Title}
                  onChange={onFormControlChange}
                />

                <div className="flex my-4">
                  <MenuToggle
                    name="A"
                    onChange={onMenuToggleButtonClicked}
                    isChecked={mandatoryData.MenuA !== ""}
                  />
                  <MenuToggle
                    name="B"
                    onChange={onMenuToggleButtonClicked}
                    isChecked={mandatoryData.MenuB !== ""}
                  />
                  <MenuToggle
                    name="C"
                    onChange={onMenuToggleButtonClicked}
                    isChecked={mandatoryData.MenuC !== ""}
                  />
                </div>
              </div>
            </div>
            <div className="w-full my-2">
              <div className="mb-3 w-full">
                <Creatable
                  closeMenuOnSelect={false}
                  onChange={(tags) => {
                    onTagChange(tags);
                  }}
                  value={currentTags.map((tags) => {
                    return { label: tags, value: tags };
                  })}
                  options={getAllTags()}
                  isMulti={true}
                  placeholder="Tags ..."
                  formatCreateLabel={(inputText) =>
                    `Label "${inputText}" erstellen`
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={onSaveClick}>Speichern</Button>
            </div>
          </div>
          <div className="w-2/5 bg-white ml-16">
            <div className="px-3 pt-3">
              <div className="mb-3">
                <Select
                  closeMenuOnSelect={false}
                  id={"basic-typeahead-multiple"}
                  isMulti={true}
                  options={getTagsAndNames()}
                  placeholder="Filter"
                  onChange={(selected) => {
                    onDishFilterChange(selected);
                  }}
                />
              </div>
            </div>
            <div className="pt-3 overflow-y-auto max-h-[90vh]">
              {allDishes
                ?.filter(filterDishList)
                .map((item) => {
                  return {
                    ...item,
                    tags: item.tags.filter(
                      (tag) =>
                        !(
                          tag === "Menü A" ||
                          tag === "Menü B" ||
                          tag === "Menü C"
                        )
                    ),
                  };
                })
                .map((item, idx) => {
                  return (
                    <div
                      className="flex shadow-md bg-white rounded-md mx-4 m-auto cursor-pointer mb-2"
                      key={idx}
                      onClick={() => onDishSelected(item.name)}
                    >
                      <div className="h-16 w-16 float-right aspect-h-1 aspect-w-1 overflow-hidden m-2 rounded-md bg-gray-200 aspect-none">
                        <img
                          alt="Food"
                          className="h-full w-full object-cover object-center"
                          src={
                            allImages?.find((img) => img._id === item.image)
                              ?.image
                          }
                        />
                      </div>

                      <div className="float-left">
                        <div>
                          <p className="text-left mx-1.5 text-lg w-fit h-fit">
                            {item.name}
                          </p>
                        </div>
                        <div className="flex px-1.5 pt-1.5">
                          {item.tags.map((tag, index) => (
                            <p
                              className="mr-1 rounded py-0.5 px-1 text-xs text-blue-700 bg-blue-100"
                              key={index}
                            >
                              {tag}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
