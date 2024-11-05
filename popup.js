document.getElementById('positive').addEventListener('click', () => {
  sendFeedbackType("positive");
});

document.getElementById('neutral').addEventListener('click', () => {
  sendFeedbackType("neutral");
});

document.getElementById('negative').addEventListener('click', () => {
  sendFeedbackType("negative");
});

function sendFeedbackType(type) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: fillFeedback,
      args: [type]
    });
  });
}

function fillFeedback(type) {
  fetch("https://erp.iitj.ac.in/AcadResearch/getsubjectlistforfeedback.htm?order=asc&_=1730831282661", {
    headers: {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    referrer: "https://erp.iitj.ac.in/AcadResearch/feedbackform.htm",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include"
  })
  .then(async (res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const subjects = await res.json();
    console.log(subjects);

    subjects.forEach(subject => {

      const options = {
        "lecture" : {
          type : "L",
          count : 34
        },
        "tutorial" : {
          type : "T",
          count : 34
        },
        "practical" : {
          type : "P",
          count : 40
        }
    }
    const optioons = [
      "lecture",
      "tutorial",
      "practical"
    ]
      var type,count;

      for( var i =0 ; i<3;i++ ) {
        if ( subject[optioons[i]] === "Pending" ) {
          type = options[optioons[i]].type
          count = options[optioons[i]].count          
        }
      }

      const baseParams = {
        action: '',
        subtype: type,
        instructor: subject.instructor,
        subno: subject.course_code,
        captcha: 'HX)Kya'
    };


    console.log(count)
    const responses = Array(count).fill(5); // Fill first 30 responses with 5
    responses.push('The course was challenging but fair, with interesting case studies.'); // Add comment

    const payload = new URLSearchParams(baseParams);

    responses.forEach((response, index) => {
      payload.append(`response_${index + 1}`, response);
    });

      fetch("https://erp.iitj.ac.in/AcadResearch/insertfeedback.htm", {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        referrer: "https://erp.iitj.ac.in/AcadResearch/feedbackform.htm",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: payload,
        method: "POST",
        mode: "cors",
        credentials: "include"
      })
      .then(response => response.text())
      .then(data => {
        console.log("API call successful:", data);
      })
      .catch(error => console.error("API call failed:", error));
    });
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });
}
