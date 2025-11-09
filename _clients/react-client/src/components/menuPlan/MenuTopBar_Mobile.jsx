import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React from "react";
import MenuToggle from "../menuPlanCreation/MenuToggle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuTopBar({
  handleBackClicked,
  text,
  handleForwardClicked,
  menuFilter,
  setMenuFilter,
}) {

  const handleMenuChange = (name) => {
    setMenuFilter({...menuFilter, [name]:!menuFilter[name]})
 }

  return (
    <div className="border-b border-b-slate-400 h-full flex items-center">
      <div className={classNames(!handleBackClicked ? "invisible my-auto grow" : "my-auto grow")}>
        <ChevronLeftIcon
          className="w-9 h-9 float-left cursor-pointer hover:bg-gray-300 rounded-full"
          onClick={handleBackClicked}
        ></ChevronLeftIcon>
      </div>

      {menuFilter &&
      <div className='my-auto grow'>
        <MenuToggle name="A" size="9" onChange={handleMenuChange} isChecked={menuFilter.A}/>
        <MenuToggle name="B" size="9" onChange={handleMenuChange} isChecked={menuFilter.B}/>
        <MenuToggle name="C" size="9" onChange={handleMenuChange} isChecked={menuFilter.C}/>
      </div>}

      <div className="my-auto grow">
        <h2 className="text-xl select-none">{text}</h2>
      </div>

      <div className={classNames(!handleForwardClicked ? "invisible my-auto grow" : "my-auto grow")}>
        <ChevronRightIcon
          className="w-9 h-9 float-right cursor-pointer hover:bg-gray-300 rounded-full"
          onClick={handleForwardClicked}
        ></ChevronRightIcon>
      </div>
    </div>
  );
}
