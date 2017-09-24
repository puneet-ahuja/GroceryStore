(function(){
	//variable declaration
	var btnSubmit;
	var btnReset;
	var liTemplate;
	var txtGroceryName , txtGroceryDesc , txtGroceryPrice;
	var groceryList;
	var groceries;//to maintain list of groceries 
	var concernedLi = null;
	var lgdTitle;

	//variable defination
	btnSubmit = document.getElementById("btnSubmit");
	btnReset = document.getElementById("btnReset");
	liTemplate = document.getElementById("liTemplate");

	txtGroceryName = document.getElementById("txtGroceryName");
	txtGroceryDesc = document.getElementById("txtGroceryDesc");
	txtGroceryPrice = document.getElementById("txtGroceryPrice");

	groceryList = document.getElementById("groceryList");
	lgdTitle = document.getElementById("lgdTitle");

	groceries = [];





	//function defination

	/*Function to generate li from template 
	and return that node to calling function*/
	function liGenerator(grocery){
		var src = liTemplate.innerHTML;
		console.log(src);

		src = src.replaceAll("{{groceryTitle}}" , grocery.title);
		src = src.replaceAll("{{groceryDesc}}" , grocery.desc);
		src = src.replaceAll("{{groceryPrice}}" , grocery.price);

		console.log(src);
		var node = document.createElement('li');
		node.setAttribute("groceryId" , grocery.id);
		node.innerHTML = src;

		return node;

	}

	//Function to add grocery
	function addGrocery(grocery){
		if(groceries.length===0){
			grocery.id = 1;
		}else{
			grocery.id = groceries[ groceries.length - 1].id + 1;
		}
		

		var node = liGenerator(grocery);

		console.log("Node created " +node.getAttribute("groceryId"));
		console.log("Grocery Added");
		console.log("Grocery id : " + grocery.id);
		console.log("Grocery Title : " + grocery.title);
		console.log("Grocery desc : " + grocery.desc);
		console.log("Grocery price : " + grocery.price);
		
		

		//Adding grocery to object in memory
		groceries.push(grocery);
		//Adding grocery to local storage
		persist();

		//Adding grocery to ui
		groceryList.appendChild(node);
		btnReset.click();
	}


	function updateGrocery(grocery){
		grocery.id = concernedLi.getAttribute('groceryId');

		concernedLi.querySelector('[purpose="groceryTitle"]').setAttribute("data-val" , grocery.title);
		concernedLi.querySelector('[purpose="groceryDesc"]').setAttribute("data-val" , grocery.desc);
		concernedLi.querySelector('[purpose="groceryPrice"]').setAttribute("data-val" , grocery.price);
		console.log("Attribute Vallues Updates");

		concernedLi.querySelector('[purpose="groceryTitle"]').innerHTML = grocery.title;
		concernedLi.querySelector('[purpose="groceryDesc"]').innerHTML = grocery.desc;
		concernedLi.querySelector('[purpose="groceryPrice"]').innerHTML = grocery.price
		console.log("InnerHTML of Concerned li updated");

		for(var i = 0 ; i < groceries.length ; i++){
			if(groceries[i].id == grocery.id){
				groceries[i] = grocery;
				break;
			}
		}
		console.log("Element replaced id array");

		persist();
		concernedLi=null;
		btnSubmit.value = "Add Grocery";
		lgdTitle.innerHTML = "Add Grocery";
		setUp();          
		console.log("Stored to local Storage");
		window.event.preventDefault();
		btnReset.click();
	}


	/*Function to get values from localstorage 
	and display on screen*/
	function setUp(){
		//Fetching data from local storage
		var groceriesData = localStorage.getItem('groceries');

		//Condition to test data fecthed or not
		if(groceriesData){
			groceries = JSON.parse(groceriesData);
			groceryList.innerHTML = '';
			for(var i = 0 ; i < groceries.length ; i++){
				var node = liGenerator(groceries[i]);
				groceryList.appendChild(node);
			}
		}
	}

	function persist(){
		window.localStorage.setItem("groceries" , JSON.stringify(groceries));
	}

	function handleListClick(){
		var se = event.srcElement;
		//Delete click handler
		if(se.tagName === "SPAN"){
			concernedLi = se.parentNode;
			console.log("concernedLi" + concernedLi);
			var groceryId = concernedLi.getAttribute("groceryId");
			console.log("Concerned Li GroceryId "+ groceryId);

			var titleValue = se.nextElementSibling.getAttribute("data-val");

			var confirm = window.confirm("Are you sure that u want to delete "+titleValue+"?");
			if(confirm){
				for(var i = 0 ; i < groceries.length ; i++ ){
					if(groceries[i].id == groceryId){
						groceries.splice(i,1);
						se.parentNode.remove();
						persist();
						break;
					}

				}
			}
			if(concernedLi.getAttribute("groceryId") == groceryId){
				concernedLi=null;
				btnSubmit.value = "Add Grocery";
				lgdTitle.innerHTML = "Add Grocery";
				setUp();

				btnReset.click();
			}
		}
		else if(se.tagName === "UL"){
			//Do nothing
		}
		else{
			if(se.tagName === "LI"){
				concernedLi=se;
			}else{
				concernedLi=se.parentNode;
			}
			btnSubmit.value = "Update Grocery";
			lgdTitle.innerHTML = "Update Grocery";


			var allLi = document.querySelectorAll("li");
			for(var i = 0 ; i < allLi.length ; i++ ){
				allLi[i].style.backgroundColor = "#FAD7A0";
			}
			concernedLi.style.backgroundColor = "#E67E22";
			txtGroceryName.value = concernedLi.querySelector('[purpose="groceryTitle"]').getAttribute("data-val");
			txtGroceryDesc.value = concernedLi.querySelector('[purpose="groceryDesc"]').getAttribute("data-val");
			txtGroceryPrice.value = concernedLi.querySelector('[purpose="groceryPrice"]').getAttribute("data-val");
		}
	}

	function isValid(grocery){
		if(grocery.title === ""){
			alert("Title can't be blank");
			return false;
		}

		if(grocery.desc === ""){
			alert("Desc can't be blank");
			return false;
		}

		if(grocery.price === ""){
			alert("Price can't be blank");
			return false;
		}

		var existing = document.querySelector('li [purpose="groceryTitle"][data-val="'+grocery.title+'"]');

		if(existing != null && (concernedLi == null || existing.parentNode !== concernedLi)){
			alert("Title can't be duplicate");
			return false;
		}
		var price = parseInt(grocery.price);
		if(price < 0){
			alert("Price can't be negative");
			return false;
		}

		return true;
	}


	/*Function to handle Submit button click
		This function redirects flow to update or add grocery*/
	function handleSubmitClick(){
		var grocery = {};
		grocery.title = txtGroceryName.value;
		grocery.desc = txtGroceryDesc.value;
		grocery.price = txtGroceryPrice.value;

		if(concernedLi === null){
			if(isValid(grocery)){
				addGrocery(grocery);
			}
		}else{
			if(isValid(grocery)){
				updateGrocery(grocery);
			}
		}
		
		window.event.preventDefault();
	}

	//Function to add event listeners and call setup initially
	function init(){

		//Adding listeners 
		btnSubmit.addEventListener('click' , handleSubmitClick);
		groceryList.addEventListener('click' , handleListClick);
		//call to setup the page
		setUp();
	}

	init();

})();