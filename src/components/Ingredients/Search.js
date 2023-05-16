import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    //enteredFilter is a value set before the timer Start, because a function is first instantiated before it is called,
    //during this instansiation and value is given to enteredFilter from the user userInput and is not read again,
    //if the user starts typin, useEffect runs again, there by calling setTimeOut which re-instanitiate its value again, which means
    //enteteredFilter will be given the currrent value of the user at that moment, since useEffect runs again when the user Starts typing,
    //setTimeOut will be called again and again, when the user Stops typing, setTimeout will be allowed to count down
    //ones it gets to 500ms, the fn inside setTime out will run, and enteredFilter(value given the moment when the fn inside setTimeout is
    //instanitiated again) will be compared to  inputRef.current.value(the current userInput); if the are the same,
    //that means the user paused for 500ms and an http request will be sent, since the user has stopped typing,
    //useEffect won't run again until the user Types again and the whole process restarts
    //so now enteredFilter is set then the timer start counting, when we get to 500ms, the time times-out
    //so its fn runs, now we are comparing the value 500ms ago(enteredFilter) to the current user Value(inputRef.current.value)
    //enabling us to send a request if the user stops typing for 500ms
    //module 28 video 15

    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch("INPUT-FIREBASE-URL" + query)
          .then((response) => response.json())
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
