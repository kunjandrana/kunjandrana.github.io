/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */
 
var clickEvent = document.createEvent('Event');
clickEvent.initEvent('radioClickEvent',true,true);

jsPsych.plugins['continuousresp-mousetracking'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'continuousresp-mousetracking',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {type: jsPsych.plugins.parameterType.STRING,
                     pretty_name: 'Prompt',
                     default: undefined,
                     description: 'Questions that are associated with the slider.'},
          labels: {type: jsPsych.plugins.parameterType.STRING,
                   array: true,
                   pretty_name: 'Labels',
                   default: undefined,
                   description: 'Labels to display for individual question.'},
          required: {type: jsPsych.plugins.parameterType.BOOL,
                     pretty_name: 'Required',
                     default: false,
                     description: 'Makes answering questions required.'}
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'String to display at top of the page.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

	var mousedata = [];

    var html = "";
    // inject CSS for trial
    html += '<style id="jspsych-survey-likert-css">';
    html += ".jspsych-survey-likert-statement { display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px; }"+
      ".jspsych-survey-likert-opts { list-style:none; width:100%; margin:0; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
      ".jspsych-survey-likert-opt-label { line-height: 1.1em; color: #444; }"+
      ".jspsych-survey-likert-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
      ".jspsych-survey-likert-opts:last-of-type { border-bottom: 0; }"+
      ".jspsych-survey-likert-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
      ".jspsych-survey-likert-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"+
      ".jspsych-survey-mousebox { display:block; width: 20px; height: 20px; position: absolute; background-color: black; top:95%; left:50%; margin-top: -10px; margin-left: -10px; }"
    html += '</style>';

    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-likert-preamble" class="jspsych-survey-likert-preamble">'+trial.preamble+'</div>';
    }
    html += '<form id="jspsych-survey-likert-form">';

    // add likert scale questions
    for (var i = 0; i < trial.questions.length; i++) {
      // add question
      html += '<label class="jspsych-survey-likert-statement">' + trial.questions[i].prompt + '</label>';
      // add options
      var width = 100;
      html += '<div id="responsebox" style="display:block; margin: auto; width: 500px; height: 40px; border: 1px solid black; background-color: white" onclick=\'document.querySelector("#jspsych-survey-likert-form").dispatchEvent(clickEvent);\'><div id="respratinglevel" style="display: block; width: 250px; height: 40px; background-color: black;"></div> </div>';
      
      html += '<div id="responselabelbox" style="display:flex; margin: auto; width: 500px;">';
      
      var alignment = '';
      console.log(trial.questions[i].labels.length);
      for (var j = 0; j < trial.questions[i].labels.length; j++) {
      	if (j == 0) {
      		alignment = 'left';
      	}
      	else if (j == trial.questions[i].labels.length-1) {
      		alignment = 'right';
      	}
      	else {
      		alignment = 'center';
      	}
      	console.log(j);
//      	html += '<div style="display:inline-block; width: ' + 100./trial.questions[i].labels.length + '%; text-align:'+ alignment + '>'+ trial.questions[i].labels[j] +'</div>';
      	html += '<div style="flex: 1; text-align:'+ alignment + '">'+ trial.questions[i].labels[j] +'</div>';
      }
      
      html += '</div>';
      
      // width = 100 / trial.questions[i].labels.length;
//       var options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
//       for (var j = 0; j < trial.questions[i].labels.length; j++) {
//         options_string += '<li style="width:' + width + '%"><input type="radio" onclick=\'document.querySelector("#jspsych-survey-likert-form").dispatchEvent(clickEvent);\' name="Q' + i + '" value="' + j + '"';
//         if(trial.questions[i].required){
//           options_string += '';
//         }
//         options_string += '><label class="jspsych-survey-likert-opt-label">' + trial.questions[i].labels[j] + '</label></li>';
//       }
//       options_string += '</ul>';
//       html += options_string;
    }

    // add submit button
    // html += '<input type="submit" id="jspsych-survey-likert-next" class="jspsych-survey-likert jspsych-btn" value="'+trial.button_label+'"></input>';

    html += '</form>';
    
    html += '<div class="jspsych-survey-mousebox"></div>';
	
    display_element.innerHTML = html;
    
    var respratinglevelbox = document.getElementById("respratinglevel");
    var rlboffsets = respratinglevelbox.getBoundingClientRect();
	var rlbtop = rlboffsets.top;
	var rlbleft = rlboffsets.left;
    
    function getMousePosition(e) {
    	var xpos = e.clientX;
    	var ypos = e.clientY;
    	var tt = (new Date()).getTime() - startTime;
    	display_element.querySelector('#jspsych-survey-likert-form')
    	
    	if (ypos >= rlbtop && ypos <= (rlbtop+40) && xpos >= rlbleft && xpos <= (rlbleft+500)) {
    		respratinglevelbox.style.width = xpos-rlbleft+"px";
    		//console.log(xpos-rlbleft);
    	}
    	
    	
    	mousedata.push({x: xpos, y: ypos, t: tt});
    	//console.log("("+xpos+","+ypos+")");
    }
    
    document.querySelector('.jspsych-content-wrapper').addEventListener("mousemove", getMousePosition);

    display_element.querySelector('#jspsych-survey-likert-form').addEventListener('radioClickEvent', function(e){
//    display_element.getElementsByTagName('radio').foreach(function(elem){
//    elem.addEventListener('click', function(e){    
    
    //function recordTrialResponse() {
      //e.preventDefault();
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('#jspsych-survey-likert-form .jspsych-survey-likert-opts');
      for(var index = 0; index < matches.length; index++){
        var id = matches[index].dataset['radioGroup'];
        var el = display_element.querySelector('input[name="' + id + '"]:checked');
        if (el === null) {
          var response = "";
        } else {
          var response = parseInt(el.value);
        }
        var obje = {};
        obje[id] = response;
        Object.assign(question_data, obje);
      }
		
	  document.querySelector('.jspsych-content-wrapper').removeEventListener("mousemove", getMousePosition);
      // save data
      // console.log(respratinglevelbox.clientWidth/500.);
      var trial_data = {
        "rt": response_time,
        "response": respratinglevelbox.clientWidth/500.,
        "mousedata": mousedata
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trial_data);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
