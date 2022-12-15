const generateTimeSlots = (starttime, endtime, interval) => {
  let timeslots = [];
  let count = 0;
  while (starttime.isBefore(endtime)) {
    // console.log(timeslots)
    // console.log(true)
    if (count == 0) {
      timeslots.push({
        startTime: moment(starttime).format("hh:mm a"),
        endTime: moment(starttime).add(interval, "minutes").format("hh:mm a"),
        available: true
      });

      count += 1;
    } else {
      // console.log()
      let time = timeslots[timeslots.length - 1].endTime;
      // console.log(time)
      timeslots.push({
        startTime: timeslots[timeslots.length - 1].endTime,
        endTime: moment(starttime)
          .add(interval * count, "minutes")
          .format("hh:mm a"),
        available: true
      });
    }
    starttime = moment(starttime).add(interval, "minutes");
  }
  return timeslots;
};

const convertTime12to24_2 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier.toUpperCase() === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};
const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  // console.log(time,modifier)
  let [hours, minutes] = time.split(":");
  // console.log("hours",hours)
  if (hours === "12") {
    hours = "00";
  }
  if (modifier.toUpperCase() === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return hours;
};

export { generateTimeSlots, convertTime12to24_2, convertTime12to24 };
