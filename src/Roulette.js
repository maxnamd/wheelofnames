// Roulette.js
import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Swal from "sweetalert2";
import gif from "./images/giphy.gif"
const Roulette = ({ data, onWin, func, isFunc }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [winningEntry, setWinningEntry] = useState("");
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [rouletteData, setRouletteData] = useState(data);
  const [isFinished, setIsFinished] = useState(false);
  const handleSpinClick = () => {
    if (isFinished == false || rouletteData.length > 1) {
      let newPrizeNumber = Math.floor(Math.random() * rouletteData.length);
      if (rouletteData.length == 1) {
        newPrizeNumber = 0;
      }
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);

      const newWinningEntry = rouletteData[newPrizeNumber].completeOption;
      setWinningEntry(newWinningEntry);
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The previous roullete is completed. You need to add more participants!"
      });
    }
  };
  useEffect(() => {

    const jsonString = localStorage.getItem('participants');
    if (jsonString) {
      setRouletteData(JSON.parse(jsonString));
    }
    else {
      const addShortString = data.map((item) => {
        return {
          completeOption: item.text,
          option:
            item.text.length >= 30
              ? item.text.substring(0, 30).trimEnd() + "..."
              : item.text
        };
      });
      setRouletteData(addShortString);
    }

  }, [data]);

  const handleRemoveWinningEntry = () => {
    // Remove the winning entry from the roulette data
    console.log(rouletteData);

    if (rouletteData.length == 1) {
      Swal.fire({
        title: "Champiooon",
        text: "Last Person In Roullet",
        icon: "info"
      });
      setIsFinished(true);
    }
    else {
      const updatedData = rouletteData.filter(
        (item) => item.completeOption !== winningEntry
      );

      localStorage.setItem('participants', JSON.stringify(updatedData));

      setRouletteData(updatedData);
      Swal.close();
    }

  };

  return (
    <>
      <div align="" className="roulette-container">
        <Wheel
          mustStartSpinning={mustSpin}
          spinDuration={[0.3]}
          prizeNumber={prizeNumber}
          data={rouletteData}
          outerBorderColor={["#feed65"]}
          outerBorderWidth={[5]}
          innerBorderColor={["#f2f2f2"]}
          radiusLineColor={["tranparent"]}
          radiusLineWidth={[1]}
          textColors={["#f5f5f5"]}
          textDistance={90}
          fontSize={[10]}
          backgroundColors={[
            "#3f297e",
            "#175fa9",
            "#169ed8",
            "#239b63",
            "#64b031",
            "#efe61f",
            "#f7a416",
            "#e6471d",
            "#dc0936",
            "#e5177b",
            "#be1180",
            "#871f7f"
          ]}
          onStopSpinning={() => {
            setMustSpin(false);
            // Show SweetAlert2 popup
            onWin(winningEntry);
            Swal.fire({
              title: `${winningEntry} is the Winning Entry?`,
              text: `Do you want to remove the winning entry "${winningEntry}" from the Roulette Data?`,
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Yes, remove it!",
              cancelButtonText: "No, keep it",
              allowOutsideClick: false,
              backdrop: `
                rgba(0,0,123,0.4)
                url("${gif}")
                left top
              `
            }).then((result) => {

              if (result.value) {
                handleRemoveWinningEntry();
              }
              else {
              }
            });
          }}
        />
        <button className="button roulette-button" onClick={handleSpinClick}>
          Spin
        </button>

      </div>
      <br />
      <button onClick={handleSpinClick} disabled={mustSpin} type="button" style={{ visibility: "hidden" }} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        {!mustSpin ? winningEntry : "Spinning..."}
        {!winningEntry && "CLICK TO SPIN"}
      </button>

    </>
  );
};

export default Roulette;
