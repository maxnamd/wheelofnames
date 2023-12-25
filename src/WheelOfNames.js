// WheelOfNames.js
import React, { useEffect, useState } from "react";
import Roulette from "./Roulette";
// import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import img from "./images/xmas.png"
const WheelOfNames = () => {
  const initialData = [
    {
      id: 1,
      text: "Princess Mae",
    },
    {
      id: 2,
      text: "Allysa Genesis",
    },
    {
      id: 3,
      text: "Andrea B",
    },
  ];

  const [textareaValue, setTextareaValue] = useState("");
  const [rouletteData, setRouletteData] = useState(initialData);
  const [winningEntries, setWinningEntries] = useState([]);
  const localStorageKey = 'participants';
  useEffect(() => {
    // Retrieve the value from local storage
    const localStorageValue = localStorage.getItem(localStorageKey);
    try {
      // Parse the JSON string
      const parsedData = JSON.parse(localStorageValue);

      // Check if it's an array
      if (Array.isArray(parsedData)) {
        // Extract the "option" values and join them with newline characters
        const optionValues = parsedData.map(obj => obj.option);
        const formattedString = optionValues.join('\n');
        setTextareaValue(formattedString);
      } else {
        // Handle other data structures if needed
        setTextareaValue(localStorageValue || '');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setTextareaValue(localStorageValue || '');
    }
  }, [localStorageKey]);

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const handleUpdateRouletteData = () => {
    const newTexts = textareaValue
      .split("\n")
      .filter((text) => text.trim() !== "");

    const newData = newTexts.map((text, index) => ({ id: index + 1, text }));

    console.log(newData);
    if (newData.length > 0) {
      // Function to find and return duplicated texts based on the 'text' property without spaces
      const findDuplicates = (array) => {
        const seen = new Set();
        const duplicates = [];

        array.forEach((item) => {
          const textWithoutSpaces = item.text.replace(/\s/g, "").toLowerCase(); // Remove spaces and make it case-insensitive
          if (seen.has(textWithoutSpaces)) {
            duplicates.push(item.text);
          }
          seen.add(textWithoutSpaces);
        });

        return duplicates;
      };

      // Find and get the duplicated texts in newData
      const duplicatedTexts = findDuplicates(newData);

      if (duplicatedTexts.length > 0) {
        console.log("");
        let html_text = '';
        for (let i = 0; i < duplicatedTexts.length; i++) {
          html_text += `<p style='margin-bottom:0px;'>${duplicatedTexts[i]}</p>`
        }
        Swal.fire({
          icon: "error",
          title: "Duplicate inputs found!",
          html: html_text
        });
      } else {
        const addShortString = newData.map((item) => {
          return {
            completeOption: item.text,
            option:
              item.text.length >= 30
                ? item.text.substring(0, 30).trimEnd() + "..."
                : item.text
          };
        });
        localStorage.setItem('participants', JSON.stringify(addShortString));


        setRouletteData(newData);
      }



    }
    else {
      Swal.fire({
        icon: "error",
        title: "No Entries Found!",
        text: "The Entries is empty. Please enter participants"
      });
    }
  };

  const handleWin = (winningEntry) => {
    const timestamp = new Date().toLocaleString();
    const newEntry = `${timestamp}: ${winningEntry}`;

    setWinningEntries((prevEntries) => [newEntry, ...prevEntries]);
  };
  return (
    <div className="relative">
      <div className="w-full absolute flex justify-center" style={{ zIndex: 100, top: -123 }} >
        <img src={img} alt="" />
      </div>

      <div className="row col-span-4 relative">
        {/* <div className="text-3xl font-bold text-blue-900 my-5 absolute">
          <h2 className="font-extrabold text-white">RKC Wheel of Names</h2>
        </div> */}
        <Roulette data={rouletteData} onWin={handleWin}/>
      </div>
      <div className="row absolute w-full flex justify-between" style={{top:150}}>
        <div className="card mt-10 w-80"  style={{zIndex:500}}>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg">
              <label htmlFor="comment" className="sr-only">Your comment</label>
              <textarea value={textareaValue}
                onChange={handleTextareaChange}
                id="message" rows="25" className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0 dark:text-black dark:placeholder-gray-400" placeholder="Write a participants..."></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:bg-red-800">
              <button onClick={handleUpdateRouletteData} type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-emerald-500 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Update Roulette Data
              </button>
              <button className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-emerald-500 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Shuffle
              </button>
            </div>
          </div>
          {/* <h5 className="font-extrabold text-2xl">Entries</h5>
          <div className="card-body">
            <textarea
              value={textareaValue}
              onChange={handleTextareaChange}
              id="message"
              rows={25}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Add names separated by new lines"
            />
            <button type="button" className="mt-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">

            </button>
          </div> */}
        </div>
        <div className="card mt-10 w-80"  style={{zIndex:500}}>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:bg-red-800">
            <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                  <p className="text-xl font-bold text-white">Results</p>
                </div>
              </div>
              <div id="tooltip-fullscreen" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Show full screen
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
            <div className="px-4 py-2 bg-white rounded-b-lg ">
              <label htmlFor="editor" className="sr-only">Publish post</label>
              <textarea readOnly
                value={winningEntries.join("\n")}
                rows={25}
                className="block w-full px-0 text-sm text-gray-800 bg-white border-0 focus:ring-0 dark:text-dark dark:placeholder-gray-400" placeholder="ALL WINNING ENTRIES WILL BE DISPLAYED HERE" required></textarea>
            </div>
          </div>
          {/* <h5 className="font-extrabold text-2xl">Results</h5>
          <textarea
            readOnly
            value={winningEntries.join("\n")}
            rows={25}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ALL WINNING ENTRIES WILL BE DISPLAYED HERE"
          /> */}
          <div className="card-body"></div>
        </div>
      </div>
    </div>
  );
};

export default WheelOfNames;
