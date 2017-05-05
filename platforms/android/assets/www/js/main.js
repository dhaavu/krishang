var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;
var numImage = 0; 
	

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
  alert('Error: ' + error.message + ' code: ' + error.code);
 //alert('Error: ');
}

// this is called when a successful transaction happens
function successCallBack() {
  

}

function nullHandler(){ };

// called when the application loads
function onBodyLoad(){

// This alert is used to make sure the application is loaded correctly
// you can comment this out once you have the application working
//alert("DEBUGGING: we are in the onBodyLoad() function");

 if (!window.openDatabase) {
   // not all mobile devices support databases  if it does not, thefollowing alert will display
   // indicating the device will not be albe to run this application
   alert('Databases are not supported in this browser.');
   return;
 }

// this line tries to open the database base locally on the device
// if it does not exist, it will create it and return a database object stored in variable db
 db = openDatabase(shortName, version, displayName,maxSize);

// this line will try to create the table User in the database justcreated/openned
 db.transaction(function(tx){

  // you can uncomment this next line if you want the User table to be empty each time the application runs
 // tx.executeSql( 'DROP TABLE item',nullHandler,errorHandler);
 	// tx.executeSql( 'DROP TABLE images',nullHandler,errorHandler);
  // this line actually creates the table User if it does not existand sets up the three columns and their types
  // note the UserId column is an auto incrementing column which isuseful if you want to pull back distinct rows
  // easily from the table.
   tx.executeSql( 'CREATE TABLE IF NOT EXISTS item(row_id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, tag TEXT NOT NULL, primary_image TEXT)',[],nullHandler,errorHandler);
//alert('item table successful'); 
 tx.executeSql( 'CREATE TABLE IF NOT EXISTS images(row_id INTEGER NOT NULL PRIMARY KEY, file_path TEXT NOT NULL, item_id INTEGER NOT NULL)',[],nullHandler,errorHandler);
//alert('image table successful'); 
 ListDBValues(""); 
 },errorHandler,successCallBack);

}

function deleteImage(element)
{
			db = openDatabase(shortName, version, displayName,maxSize);
			var id = $('#' + element).parent().attr("id");
			var imgsrc = $('#' + id + ' .itemImage').attr("src"); 
			resolveLocalFileSystemURL(imgsrc, function(entry) {
			entry.remove(function()
			{
				db.transaction(function(transaction) 
				{
					transaction.executeSql('delete from images where file_path = ?', [imgsrc], 
					function(transaction, results)
					{
						var nextImage = ""; 
						var imageSelected = $('#SelectedImage img').attr("src");
						if(imageSelected == imgsrc)
						{
							var nextId = $('#' + id).next().attr("id");
							if(nextId === undefined) 
							{
								nextId = $('#' + id).prev().attr("id");
							} 
							if(nextId === undefined) 
							{
								$('#SelectedImage img').attr("src", ""); 
							} 
							else 
							{
								nextImage = $('#' + nextId + ' .itemImage').attr("src"); 
								$('#SelectedImage img').attr("src", nextImage); 
							}
														
						}
						$('#' + id).remove(); 
					},  errorHandler ); 
				}, errorHandler);  
			}, function(){alert("failed"); });}); 
			
			
		}
function GetPhoto()
{
			try {
			
				//	alert('Take Photo'); 
					
					 navigator.camera.getPicture(onSuccess, onFail, {
								quality: 100,
								targetWidth: 400,
								targetHeight: 400,
								destinationType: Camera.DestinationType.FILE_URI ,
								correctOrientation: true
							 });
							 
							 
				/*	 navigator.camera.getPicture(
							function(imageURI) {
								window.resolveLocalFileSystemURI(imageURI, function fileEntrySuccess(fileEntry) {
									window.resolveLocalFileSystemURI(cordova.file.dataDirectory, 0, function directoryEntrySuccess(directoryEntry) {
										var d = new Date();
										var uniqueNewFilename = Date.parse(d) + ".jpg";
										fileEntry.moveTo(directoryEntry.root, uniqueNewFilename, function moveFileSuccess(newFileEntry) {
											var picPath = newFileEntry.fullPath;
											alert('directory Path: ' + directoryEntry.name ); 
											navigator.camera.cleanup(function(){}, function(){});
											 $('#image').append(' <img  class="itemImage" onclick="javascript:changeImage(this.src)" style="float:left; margin:1px; cursor:pointer" src="' + picPath + '" >'); 
   $('#SelectedImage').html('<img id="LargeImage" style="margin:2px; cursor:pointer; width:100%;  height:400px;" src="' + picPath + '" >');
//alert(imageData);   
$('#image').css('display','block');
$('#SelectedImage').css('display','block');

										}, function(){});
									}, function(){});
								}, function(){});
							}, function(message) {
								navigator.notification.alert(message, function(){}, 'Picture Not Added');
							}, {
								quality: 100,
								destinationType: Camera.DestinationType.FILE_URI, 
								correctOrientation: true
							}); */
				} 
			catch (err) {
				alert('error:' + err.message); 
					
			}
		}
		
function onSuccess(imageURI) {
	try{
	
	/*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileEntry){
	alert(fileEntry.name);
	}, function(){}); */
	
   $('#image').append('<div style="float: left; margin: 6px 0px 0px 6px;" id="' + numImage +  '"><img id="close_1' + numImage +'" style="display:block;" class="close-image" onclick="javascript:deleteImage(this.id)" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-circled-128.png" onclick="javascript:deleteImage(this.id)"> <img  class="itemImage" onclick="javascript:changeImage(this.src)" style="cursor:pointer" src="' + imageURI + '" ></div>'); 
   numImage = numImage + 1; 
   $('#SelectedImage').html('<img id="LargeImage" style="margin:2px; cursor:pointer; width:100%;  height:400px;" src="' + imageURI + '" >');
//alert(imageData);   
$('#image').css('display','block');
$('#SelectedImage').css('display','block');

  } 
   
   catch(err){
   alert('error:' + err.message); 
   
   }
   
   }

function onFail(){
alert("Photo Capture Canceled"); 
}

function changeImage(src)
{

    $('#LargeImage').attr('src', src);
}



function AddValueToDB(ButtonId) {
Additems(ButtonId); 

}



 function UpdateValue(){

try
{

 if (!window.openDatabase) {
   alert('Databases are not supported in this browser.');
   return;
 }
 
  var x = document.URL;
 
 x= x.split('=')[1]; 


db = openDatabase(shortName, version, displayName,maxSize);

 
 db.transaction(function(transaction) {
   transaction.executeSql('update item set name = ? , tag = ? , primary_image = ? where row_id = ?', [$('#name').val(), $('#tag').val(), $('#SelectedImage img').attr('src'), x], 
   function(transaction, results)
			{
				 $('#image .itemImage').each
			   (
				   function() 
				   { 
					transaction.executeSql('INSERT OR REPLACE INTO images (row_id, file_path, item_id)   VALUES (?, ?, ?);', [parseInt($(this).attr('id')), $(this).attr('src'), parseInt(x) ], nullHandler, errorHandler); 
				    }
				); 
			alert('Item Saved'); 
			document.getElementById("name").readOnly = true; 
			document.getElementById("tag").readOnly = true; 
			$('.close-image').css('display','none');
			$('#AddAndDone').css('display','none');
			$('#addImages').css('display','none');
			}, errorHandler ); 
}, errorHandler);  

}
catch(err) 
{
	alert(err); 
}

} 

function Additems (ButtonId)
{
	try{

 if (!window.openDatabase) {
   alert('Databases are not supported in this browser.');
   return;
 }
//alert('Furst Name:' + $('#txFirstName').val()); 
// this is the section that actually inserts the values into the User table



 db.transaction(function(transaction) {
 var itemid; 
 //alert('done:' +  $('#SelectedImage img').attr('src')); 
   transaction.executeSql('INSERT INTO item(name, tag, primary_image)VALUES (?,?,?)',[$('#name').val(), $('#tag').val(), $('#SelectedImage img').attr('src')], 
			function(transaction, results)
			{
			   itemid = results.insertId;
	
			   $('#image .itemImage').each
			   (
				   function() 
				   { 
						
						transaction.executeSql('INSERT INTO images(item_id, file_path)VALUES (?,?)',[itemid, $(this).attr('src')],  nullHandler, errorHandler);
		
						
				   }
				);
			    navigateto(ButtonId); 
/* 				$('#name').val(''); 
$('#tag').val('');
$('#image').html(''); 
$('#SelectedImage').html('');   
 */

				
            },errorHandler);
   
  }, errorHandler);

// this calls the function that will show what is in the User table inthe database


		
}
catch(err) 
{
	alert(err); 
}

}

 function navigateto(ButtonId)
{
			
			
			alert('Item Added'); 
$('#name').val(''); 
$('#tag').val('');
$('#image').html(''); 
$('#SelectedImage').html('');  
$('#image').css('display','none');
$('#SelectedImage').css('display','none'); 
/* if(ButtonId == 'AddAndDone')
			{
				window.location.href= "index.html";
			}
			else
			{
				window.location.href= "add.html";	
			} */

} 

function ListDBValues(SearchVal){
try{
 if (!window.openDatabase) {
  alert('Databases are not supported in this browser.');
  return;
 }

// this line clears out any content in the #lbUsers element on the page so that the next few lines will show updated
// content and not just keep repeating lines
 $('#lbUsers').html('');
 
 

// this next section will select all the content from the User table and then go through it row by row
// appending the UserId  FirstName  LastName to the  #lbUsers element on the page
 db.transaction(function(transaction) {
   transaction.executeSql('SELECT row_id, name , tag, primary_image FROM item where name like ? or tag like ?;', ['%' + SearchVal + '%', '%' + SearchVal + '%'],
     function(transaction, result) {
      if (result != null && result.rows != null) {
		$('#SearchList').empty(); 
        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);
     //     $('#SearchList').append('<li> <a href="details.html?Id=' + row.row_id + '"><div style="float:left"><img src="'+ row.primary_image + '"></div><div style="float:left; margin-left:3px; ">  <h3>'+ row.name +'</h3><p>'+ row.tag +'</p></div><div style="float:right; text-align:center; margin-right:3px; "> <img style="width:20px;height:20px; position: relative; top: 50%;transform: translateY(100%); -webkit-transform: translateY(100%); " src="themes/images/icons-png/carat-r-white.png"/> <div> </a></li>');
		$('#SearchList').append('<a href="details.html?Id=' + row.row_id + '"><li class="list"><div style="float:left"><img src="'+ row.primary_image + '">	</div><div style="float:left; margin-left:3px; ">  <h3>'+ row.name +'</h3><p>'+ row.tag +'</p></div><div style="float:right; text-align:center; margin-right:17px;"  class="radio_div"> <input class="check" type="checkbox" style="width:20px;height:20px; position: relative; top: 50%;transform: translateY(100%); -webkit-transform: translateY(100%); " name="Select_'+row.row_id+'" /></div>	<div class="arrow_div" style="float:right; text-align:center; margin-right:3px; "> <img style="width:20px;height:20px; position: relative; top: 50%;transform: translateY(100%); -webkit-transform: translateY(100%); " src="themes/images/icons-png/carat-r-red.png"/> </div> </li>	</a>');		
		$('#searchResults').css('display','block'); 
		  
        }
	//	$("SearchList").blur(); 

      }
	  else {
	  $('#SearchList').empty(); 
	  }
     },errorHandler);
 
 },errorHandler,nullHandler);

 return;
}
catch(err) { alert(err); }
}

function deleteRecord(x, multi){
if(multi== 'N')
{
	var con = confirm('Are you sure you want to Delete this item ?'); 
	if(!con)
	{
		return; 
	}
}
db = openDatabase(shortName, version, displayName,maxSize);
db.transaction(function(transaction) {
transaction.executeSql('delete from images where item_id = ?', [x], function (){}, function (){}); 
transaction.executeSql('delete from item where row_id = ?', [x], function (){}, function (){}); 
if(multi== 'N')
{
	alert("Record Deleted"); 
	window.history.back();
}

} ); 
}

function multiSelect(){
$('#selectIcon').css('display', 'none'); 
$('#cancelIcon').css('display', 'inline'); 
$('#checkAll').css('display', 'inline'); 
$('#deleteIcon').css('display', 'inline'); 

$('.radio_div').css('display', 'block'); 
$('.arrow_div').css('display', 'none'); 
$('#SearchList').find('a').attr("href","javascript:void(0)"); 
//$('#SearchList').find('li').attr("onclick","selectItem(this)"); 
}
	
function cancelSelect(){
$('#selectIcon').css('display', 'inline'); 
$('#cancelIcon').css('display', 'none'); 

$('.radio_div').css('display', 'none'); 
$('#checkAll').css('display', 'none'); 
$('#deleteIcon').css('display', 'none'); 
ListDBValues($('#search-mini').val()); 
}

function selectItem(y){
  var  x = $(y).next('input').prop('checked'); 
$(y).next('input').prop('checked', !x); 
}



function deleteSelected()
{
	
	var boxes = $(".check:checkbox:checked");
	var decision= confirm("Are you sure you want to delete these " + boxes.length + " items ?"); 
	if(decision)
	{
		for(var i=0; i<boxes.length; i++)
		{
			deleteRecord(boxes[i].name.substring(7), 'Y'); 
			
		}
		alert("Items deleted !!! ");
		cancelSelect(); 
	}
	else 
	{
		cancelSelect(); 
	}
}

$(document).ready(function() {

$('.list').click(function(){
  var  x = $(this).next('input').prop('checked'); 
$(this).next('input').prop('checked', !x); 
}); 

$("#checkAll").change(function () {
    $(".check").prop('checked', $(this).prop("checked"));
});}); 