export default function DishList({ dishes, onDishClicked }) {
    return (
        <ul className='h-[75vh] overflow-scroll list-none'>
          {dishes.map((dish, idxDish) => 
              <div className="flex flex-row w-[95%] leading-5 select-none m-3 border rounded-md shadow-lg hover:bg-slate-200" key={idxDish} onClick={() => onDishClicked(dish)}>
              <div className="p-[0.5vw] mx-auto my-auto">
                <span>{dish.name}</span>
              </div>
            </div>
          )}
        </ul>
    );
}