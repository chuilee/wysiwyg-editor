/*
* WYSIWYG Editor
* http://wysiwyg-editor.googlecode.com/hg/index.html
* 
* (C)Copyright 2012 jankarelvisser@gmail.com
* All rights reserved
* Licensed under the LGPL license
* http://www.gnu.org/licenses/lgpl-3.0.txt
*
* This program is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
*/


function GetSelectedText (){
  var userSelection, ta;
  if (window.getSelection && document.activeElement){
    if (document.activeElement.nodeName == "TEXTAREA" ||
        (document.activeElement.nodeName == "INPUT" && 
        document.activeElement.getAttribute("type").toLowerCase() == "text")){
      ta = document.activeElement;
      userSelection = ta.value.substring(ta.selectionStart, ta.selectionEnd);
    } else {
      userSelection = window.getSelection();
    }
    return userSelection.toString();
  } else {
    // all browsers, except IE before version 9
    if (document.getSelection){       
        userSelection = document.getSelection();
        return userSelection.toString();
    }
    // IE below version 9
    else if (document.selection){
        userSelection = document.selection.createRange();
        return userSelection.text;
    }
  }
}

var Editor = window.Editor = function( selector, context,config ) {return this instanceof Wysiwyg ? this.uitvoeren( selector, context,config ) : new Wysiwyg( selector, context,config); };


var Wysiwyg_kleuren = [	'#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#ffff00', '#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada',
 '#fff2ca', '#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5', '#ffe694',
'#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#b7dde8', '#fac08f', '#f2c314', '#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#92cddc', '#e36c09', '#c09100', '#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#31859b', '#974806', '#7f6000'];


function spraak_invoer(id,words) {
    document.getElementById(id).value += words;
    document.getElementById("mic").value = "";
    document.getElementById(id).focus();

     $('#frame_'+id).hide();
     $('#'+id).show();
  }

function Wysiwyg(editor,toolbar,config) {
  this.editor_id= editor ;
  this.toolbar= toolbar ;
  this.editarea='';
  this.frame='';
  this.current='';
  this.editor()

}



function selected_text(){var txt = '';if (window.getSelection){txt = window.getSelection();}
else if (document.getSelection){txt = document.getSelection();}
else if (document.selection){txt = document.selection.createRange().text;}
else return;
return txt;
}

Wysiwyg.prototype.uitvoeren =function(){
var editor=document.getElementById(this.toolbar.id);
var images=document.getElementById('images_container_'+this.editor_id)
var frameid='frame_'+this.editor_id;
var textarea=document.getElementById(this.editor_id);
var textareaid=this.editor_id;
var frame=this.frame
var vol=null;
var editarea=frame.getElementById('page');
var actief='frame'
var geselecteerd=''


function opschonen(txt){

return txt

}

function selectie()
{

stext= frame.getSelection() || frame.selection;
if(!stext){
alert('geen selectie')
}
return stext
}
function frame_set(command,waarde) {
        if(waarde){
 	frame.execCommand(command,1,waarde)
	}
else
{
frame.execCommand(command,1,false)
}
}

function set(tt)
{

if (textarea.setSelectionRange)
{
    var selStart = textarea.selectionStart;
    var selEnd = textarea.selectionEnd;
    var val = textarea.value;
    var startVal = val.substring(0, selStart);
    var selectedVal = val.substring(selStart, selEnd);
    var endVal = val.substring(selEnd);
    //var bold = selectedVal.bold();
    textarea.value = startVal + tt + endVal;
}
else if (document.selection && document.selection.createRange)
{
    var selection = document.selection.createRange();
    selection.text = tt;
}

}
function editor_command(cmd,tag,close,waarde){
if(actief==='frame'){
frame_set(cmd,waarde)
update_editor()
}
else
{
set('<'+tag+'>'+geselecteerd+'</'+(close || tag)+'>')
update_source()
}
}


function image_menu(ob,e){
ob.style.cssText='border:4px solid red;'

}


function image_resize(ob){
ob.style.cssText='border:4px solid red;'

}


function editor_fullscreen()
{e=document.getElementById('etoolb_'+textareaid);

paf=document.getElementById(frameid);
if(!vol){

e.style.cssText='left:0px;top:0px;background-color:#fff;height:40px;width:100%;position:fixed;z-index:2049'
textarea.style.cssText='left:0px;top:40px;background-color:#fff;height:100%;width:100%;position:fixed;z-index:991'
paf.style.cssText='left:0px;top:40px;background-color:#fff;height:100%;width:100%;position:fixed;z-index:991'
//console.log(e)
vol=1;
}
else
{
e.style.cssText='width:100%'
textarea.style.cssText='width:100%;height:400px;'
paf.style.cssText='width:100%;height:400px;'
vol=null;
}

}



function update_source()
{
editarea.innerHTML=textarea.value
}
function update_editor(){

$('#'+textareaid).val(editarea.innerHTML);
}


textarea.onkeyup =function(event){update_source();}
editarea.onkeyup =function(event){update_editor();}

images.onclick = function(event) {
//alert('plaatjes')
if(event.target.className.match('plaatje')){
     //inject the image
afbeelding=event.target.getAttribute('src');
//editarea.innerHTML+='<img src="'+afbeelding+'" class="pointer image_editor" alt="" />';    

if(actief==='frame'){

frame_set('insertImage',afbeelding)
update_editor()
}
else
{
set('<img src="'+afbeelding+'" alt="" />')
update_source()
}
$('#images_'+textareaid).hide();

}
}

//actions in the editor area
editarea.onclick = function(event) {
//alert('plaatjes')
if(event.target.href){alert('link')}
if(event.target.src){alert('plaatje')}

}
editor.onmouseover = function(event) {
if(actief==='frame'){}
else
{
geselecteerd=GetSelectedText()
}
}
editor.onclick = function(event) {
if(event.target.id=='editor_bold'){editor_command('bold','strong');}
if(event.target.id==='editor_italic'){editor_command('italic','em');}
if(event.target.id=='editor_sup'){editor_command('superscript','sup');}
if(event.target.id==='editor_sub'){editor_command('subscript','sub');}
if(event.target.id==='editor_left'){editor_command('justifyleft','span style="text-align:left;"', 'span');}
if(event.target.id==='editor_right'){editor_command('justifyright','span style="text-align:right;"', 'span');}
if(event.target.id==='editor_center'){editor_command('justifycenter','span style="text-align:center;"', 'span');}
if(event.target.id==='editor_justify'){editor_command('justifyfull','span style="text-align:full;"', 'span');}
if(event.target.id==='editor_header'){editor_command('formatblock',event.target.value,false,event.target.value)}
if(event.target.id==='editor_full'){editor_fullscreen();}
if(event.target.id==='editor_voorgrond'){editor_dropdown('voorgrond_'+textareaid);}
if(event.target.id==='editor_achtergrond'){editor_dropdown('achtergrond_'+textareaid);}

if(event.target.id==='editor_contrast'){console.log(editor); $('#etoolb_'+textareaid).toggleClass('wysiwyg-editor');}
if(event.target.id==='editor_info'){editor_dropdown('achtergrond_'+textareaid);}

if(event.target.id==='editor_clear'){
var oudetekst=String(text);
kaletekst= oudetekst.replace(/(<([^>]+)>)/ig,"");
console.log(kaletekst)
tq=editarea.innerHTML;
g=tq.replace(oudetekst,kaletekst)
editarea.innerHTML=g;
}
if(event.target.id==='editor_image'){
$('#images_container_'+textareaid).load('screens/plaatjes.html');
$('#images_'+textareaid).show();
}

if(event.target.id==='htmlbar'){

$('#html_bar_'+textareaid).toggle();
}

	if(event.target.id==='editor_source' ){
	if(actief==='frame'){
event.target.className='btn btn-info pull-left'
event.target.innerHTML='&lt;/CODE&gt;'
	$('#'+frameid).hide();
	$('#'+textareaid).show();
	actief='bron'}
	else
	{
        event.target.className='btn btn-success pull-left'
        event.target.innerHTML='&lt;/WYSIWYG&gt;'
	$('#'+frameid).show();
	$('#'+textareaid).hide();
        actief='frame'
	}

	}

	}


}

Wysiwyg.prototype.editor_toolbar =function(){


voorgrond=''
for(i in Wysiwyg_kleuren)
{
console.log(Wysiwyg_kleuren[i])
voorgrond+='<div name="'+Wysiwyg_kleuren[i]+'" style="width:12px;height:12px;background-color:'+Wysiwyg_kleuren[i]+';border:1px solid black;float:left;" class="pointer">&nbsp;</div>';
}



buttonbar='<div id="etoolb_'+this.editor_id+'" class="wysiwyg-editor" style="width:100%;border:0px solid #fff">';

buttonbar+='<div class="btn-group pull-left" style="width:100%;border:1px solid green;"><span id="editor_source" title="toggle source /wysiwyg" class="btn btn-success pull-left" style="float:left">&lt;/WYSIWYG&gt;</span><span id="editor_undo" title="Undo" class="btn">Undo</span><span id="editor_redo" class="btn" title="Redo">Redo</span><span id="editor_bold" class="btn" title="Bold">B</span><em id="editor_italic" class="btn" title="Italic">i</em>'
buttonbar+='<span id="editor_underline" class="btn" style="text-decoration:underline;" title="Underline">U</span>'
buttonbar+='<span id="editor_strike" class="btn" style="text-decoration:line-through;" title="Strikethrough">S</span>'
buttonbar+='<em id="editor_voorgrond" class="btn" style="color:green;" title="Font color">a</em>'

buttonbar+='<em id="editor_achtergrond" class="btn btn-warning" title="Background color">a</em><span id="editor_chars" class="btn" title="Special chars">c</span>'


buttonbar+='<span id="editor_link" class="btn" title="Insert Link">Link</span>';
buttonbar+='<span id="editor_image" title="Insert Image" class="btn">Image</span><span id="editor_video" class="btn" title="Insert Video">Video</span><span id="htmlbar" title="HTML menu" class="btn">&lt;html&gt;</span><input class="btn" id="mic" title="Speech input" onwebkitspeechchange="spraak_invoer(\''+this.editor_id+'\',this.value)" style="margin-top:0px;width:15px;border:1px solid red" x-webkit-speech> <span  class="btn-group" style="text-align:right;right:10px;position:absolute"><span class="btn" id="editor_info" title="Info">Info</span><span class="btn" id="editor_contrast" title="Toggle editor contrast">Contrast</span><span class="btn" id="editor_full" title="Toggle editor size">F</span></span></div><br />';
buttonbar+='<div id="voorgrond_'+this.editor_id+'" class="dropdown-menu hide" style="position:relative;z-index:1000">'+voorgrond+'</div>';
buttonbar+='<div id="achtergrond_'+this.editor_id+'" class="dropdown-menu hide" style="position:relative;z-index:1000">'+voorgrond+'</div>';


buttonbar+='<div id="html_bar_'+this.editor_id+'"  style="display:none;"><br /><div class="btn-group"><select style="width:50px;float:left;" id="editor_header"><option value="H1">h1</option><option value="H2">h2</option><option value="H3">h3</option><option value="H4">h4</option><option value="P">P</option><option value="div">div</option></select><span id="editor_ul" class="btn">UL</span><span id="editor_ol" class="btn">OL</span><span class="btn" id="editor_hr">HR</span><span class="btn" id="editor_indent">indent</span><span id="editor_outdent" class="btn">outdent</span><span class="btn" id="editor_left">left</span><span class="btn" id="editor_right">right</span><span class="btn" id="editor_center">center</span><span class="btn" id="editor_justify">justify</span><span class="btn" id="editor_sub">sub</span><span class="btn" id="editor_sup">sup</span></div></div>'
buttonbar+='</div>';
imagediv='<div class="modal-header"> <span onclick="$(\'#images_'+this.editor_id+'\').hide();" class="close_dontclick close_button pull-right">&times;</span><h2>Images</h2></div><div class="modal-body"> <div id="images_container_'+this.editor_id+'">dfsf sf sfsdf</div>'

var images = document.createElement("div");
images.id='images_'+this.editor_id
images.className='modal hide'
images.innerHTML=imagediv;
ie=document.body.appendChild(images);





this.toolbar = document.createElement("div");
this.toolbar.id='editor_toolbar_'+this.editor_id
this.toolbar.style.cssText='width:99.5%;display:block;margin-top:0px;'
this.toolbar.innerHTML=buttonbar;
e=document.getElementById(this.editor_id);

e.parentNode.insertBefore(this.toolbar,e);

//images





}

Wysiwyg.prototype.create_editor =function(){

this.editor_toolbar()

var iframe = document.createElement("iframe");
//iframe.innerHTML=$('#'+this.editor_id).val()
iframe.id="frame_"+this.editor_id
iframe.style.cssText='width:99.5%;height:400px;scroll:none;overflow:none;border:1px solid green'

//this.toolbar.appendChild(iframe);

//iframe.setAttribute('contenteditable',"true");


e=document.getElementById(this.editor_id);
stijlen=''
inlijnstijl='';
try {
if(document.styleSheets && document.styleSheets[0].rules){
for(i=0;i<document.styleSheets.length;i++){
if (document.styleSheets[i].href){
stijlen+='<link media="all" type="text/css" href="' + document.styleSheets[i].href + '" rel="stylesheet">';
}
else
{
if(document.styleSheets[i].rules.length){
for(y=0;y<document.styleSheets.length;y++){
inlijnstijl+=document.styleSheets[i].rules[y].cssText;

}
}
}
}}

}
catch(err){}
//console.log(document.styleSheets[0].href)
this.editarea=  this.toolbar.appendChild(iframe);



			var frameHtml = '<!DOCTYPE html>\n';
			frameHtml += '<html><head>'+stijlen+'</head>';
			frameHtml += '<body><style>'+inlijnstijl+'\nbody{margin:0;}</style><div id="page" style="border:0px solid #fff;width:100%;height:100%;" contenteditable="true">';
			frameHtml += this.current;
			frameHtml += '</div></body></html>';
/*
this.editarea.open()
this.editarea.doc.writeln(frameHtml);
this.editarea.close()

*/
var doc = iframe.document;
    if(iframe.contentDocument)
        doc = iframe.contentDocument; // For NS6
    else if(iframe.contentWindow)
        doc = iframe.contentWindow.document; // For IE5.5 and IE6
    // Put the content in the iframe
  

    doc.open();
    doc.writeln(frameHtml);
    doc.close();


   this.frame=doc;
   this.uitvoeren()
}


Wysiwyg.prototype.editor =function(){
this.current=$('#'+this.editor_id).val();
this.create_editor();
$('#'+this.editor_id).hide()
$('#'+this.editor_id).css('height:400px;width:100%;display:none;')
//$('#editor_'+this.editor_id).html(this.current)

}


function editor_dropdown(id){


  var posx = 0; var posy = 0; 
  if(!e){e = window.event;}
  if (e.pageX || e.pageY){ 
    posx = e.pageX; 
    posy = e.pageY; 
  } 
  else {
    if (e.clientX || e.clientY){ 
      posx = e.clientX; 
      posy = e.clientY; 
    } 
  }
  
    g= [posx,posy]


//g=t_mouselocation(window.event)
if (g[0]-150<40){left=0}
else
{
left=g[0]-150
}
//hit it once
   $('#'+id).css('left:'+left+'px; top:'+(g[1])+'px');

   $('#'+id).toggleClass('show','hide');
	
}

