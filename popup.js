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
    const radioButtons = {
      positive: 4,
      neutral: 2,  
      negative: 0   
    };
  
    const value = radioButtons[type];

  
    const iframeDocument = document.getElementById('myframe').contentDocument || 
                           document.getElementById('myframe').contentWindow.document;

    const targetDiv = iframeDocument.querySelectorAll(".form-check-input");

    targetDiv.forEach((radio, index) => {
        if (index < 145 || index >= 150 ) {

            if (index % 5 === value) {
                radio.checked = true;
            }
        } else {
            if ( index === 148 ) {
                radio.checked = true;
            }
        }
    });

    const positiveReviews = [
        "The professor explains concepts clearly, using helpful real-world examples.",
        "I enjoyed the interactive activities; the professor encouraged participation.",
        "The professor is organized and sets clear expectations for assignments.",
        "The professor is available for extra help and responsive to emails.",
        "The course was challenging but fair, with interesting case studies."
    ]
    
    const negativeReviews = [
        "Lectures were hard to follow, and concepts weren't always explained clearly.",
        "There was minimal interaction, and participation wasn't encouraged.",
        "Grading criteria were unclear, with limited feedback on assignments.",
        "The professor was often unavailable for office hours or slow to respond.",
        "The workload felt overwhelming, with some assignments not relevant to the course."
    ]

    const neutralReviews = [
        "The professor's explanations were generally clear, though some topics felt rushed.",
        "Class was straightforward with a mix of lectures and some discussions.",
        "The grading seemed fair overall, but the feedback was brief.",
        "The professor was available for questions, though office hours were limited.",
        "The course workload was manageable, though a few assignments felt unnecessary."
    ]
    
    var text ;

    if ( type === "positive" ) text =  positiveReviews[Math.floor(Math.random() * 5)]
    else if ( type === "neutral" ) text =  neutralReviews[Math.floor(Math.random() * 5)]
    else if ( type === "negative" ) text =  negativeReviews[Math.floor(Math.random() * 5)]


    iframeDocument.querySelector(".form-control").value = text
  }
  