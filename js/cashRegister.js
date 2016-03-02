(function(window){
	// 商品类
	// name:商品名称
	// counts:商品个数
	// unitPrice:商品单价
	// category:商品计量单位
	// barCode:商品条形码
	function Goods(name,counts,unitPrice,category,barCode){
		this.name = name;
		this.counts = counts;
		this.unitPrice = unitPrice;
		this.category = category;
		this.barCode = barCode;

	}

	Goods.prototype.getName = function(){
		return this.name;
	};
	Goods.prototype.getCount = function(){
		return this.count;
	};
	Goods.prototype.setCount = function(count){
		this.count = count;
	};
	Goods.prototype.getUnitPrice = function(){
		return this.unitPrice;
	};
	Goods.prototype.getCategory = function(){
		return this.category;
	};
	Goods.prototype.getBarCode = function(){
		return this.barCode;
	};
	var GoodsArray = [];

	var goods1 = new Goods('苹果','1','5.5','斤','ITEM00003');
	var goods2 = new Goods('可口可乐','1','3','瓶','ITEM00001');
	var goods3 = new Goods('羽毛球','1','4','个','ITEM00002');
	var goods4 = new Goods('篮球','1','7','个','ITEM00004');
	var goods5 = new Goods('玩具熊','1','30','只','ITEM00005');
	var goods6 = new Goods('筷子','1','2','根','ITEM00006');

	GoodsArray.push(goods1);
	GoodsArray.push(goods2);
	GoodsArray.push(goods3);
	GoodsArray.push(goods4);
	GoodsArray.push(goods5);
	GoodsArray.push(goods6);

	//根据条形码从商品库GoodsArray中查询对应的名称等其他信息，返回一个商品Goods类
	var getInfoByBarCode = function(barCode){
		for(var i = 0; i < GoodsArray.length;i++){
			if(Goods.prototype.getBarCode.call(GoodsArray[i]) == barCode){
				return GoodsArray[i];
			}else{
				// alert('no match');
			}
		}
	};

	var CashRegister = function(input,discount,fullCutArray){
		this.input = input;
		this.discount = discount;
		this.fullCutArray = fullCutArray;
		this._goodsList = [];

		this._exec = function(){
			var count = 1;  
		    var distinctGoodsArray= new Array();//存放不重复的商品条码列表，如ITEM0001-3和ITEM0001-4暂时视为两种商品 
		    var sum = new Array(); // 存放不重复商品出现的次数
		    for (var i = 0; i < input.length; i++) {   
		        for(var j=i+1;j<input.length;j++)  
		        {  
		            if (input[i] == input[j]) {  
		                count++;
		                input.splice(j, 1);   
		                j--;   
		            }  
		        }  
		        distinctGoodsArray[i] = input[i];//将当前的条形码存入到distinctGoodsArray数组中  
		        sum[i] = count;  //并且将有当前条码的个数存入sum数组中  
		        count =1;  //再将count重新赋值，进入下一个条码的判断  
		    }  
		    //计算输入的条码集合中不同条码出现的次数  
		    for (var i = 0 ; i < distinctGoodsArray.length; i++) {   
		       var goods = {};
		       if(distinctGoodsArray[i].indexOf('-') != -1){
		       		// console.log(Goods.prototype.getName.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])));
		       		// console.log(distinctGoodsArray[i].split('-')[1]);
		       		goods = new Goods((Goods.prototype.getName.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0]))),
		       			Goods.prototype.getCount.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])),
		       			Goods.prototype.getUnitPrice.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])),
		       			Goods.prototype.getCategory.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])),
		       			Goods.prototype.getBarCode.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])));
		       		// console.log('sun[i] is :' + sum[i]);
		       		goods.setCount(parseInt(sum[i]) + parseInt(distinctGoodsArray[i].split('-')[1]));
		       }else{
		       		goods = new Goods(Goods.prototype.getName.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getCount.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getUnitPrice.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getCategory.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getBarCode.call(getInfoByBarCode(distinctGoodsArray[i])));
		       		goods.setCount(sum[i]);
		       }
		       
		       this._goodsList.push(goods);

		    }
		    return this._goodsList;
		};

		this._printGoodsList = function(resultList){
			var finalList = [];
			var commonContent = '******<没钱赚商店>购物清单*****\n';;
			var fullCutArrayContent = '买二赠一商品：\n';
			var totalContent = '';
			var fullCutArrayFlag = false;
			var globalFlag = false;
			var totalPrice = 0;
			var savePrice = 0;

			for(var k= 0; k < resultList.length; k++){
				var result = {};
				if(this.fullCutArray.contains(Goods.prototype.getBarCode.call(resultList[k]))){//满足满二免一优惠	
					result.total = Math.round(Goods.prototype.getUnitPrice.call(resultList[k]) * (Goods.prototype.getCount.call(resultList[k]) - Math.floor((Goods.prototype.getCount.call(resultList[k])) / 3)) * 100)/100;
					result.save = Math.round(Goods.prototype.getUnitPrice.call(resultList[k]) * Math.floor(Goods.prototype.getCount.call(resultList[k]) / 3) * 100)/100;
					result.name = Goods.prototype.getName.call(resultList[k]);
					result.unitPrice = Goods.prototype.getUnitPrice.call(resultList[k]) + '元';
					result.count = Goods.prototype.getCount.call(resultList[k]);
					result.category = Goods.prototype.getCategory.call(resultList[k]);
					result.isfullCutArray = true;
					result.isDiscount = false;
					result.freeCount = Math.floor(Goods.prototype.getCount.call(resultList[k]) / 3);
				}else if(this.discount.contains(Goods.prototype.getBarCode.call(resultList[k]))){//满足95折优惠商品
					result.total = Math.round(Goods.prototype.getUnitPrice.call(resultList[k]) * Goods.prototype.getCount.call(resultList[k]) * 0.95 * 100)/100;
					result.save = Math.round(Goods.prototype.getUnitPrice.call(resultList[k]) * Goods.prototype.getCount.call(resultList[k]) * 0.05 * 100)/100;
					result.name = Goods.prototype.getName.call(resultList[k]);
					result.unitPrice = Goods.prototype.getUnitPrice.call(resultList[k]) + '元';
					result.count = Goods.prototype.getCount.call(resultList[k]);
					result.category = Goods.prototype.getCategory.call(resultList[k]);
					result.isfullCutArray = false;
					result.isDiscount = true;
					result.freeCount = 0;
				}else{
					result.total = Math.round(Goods.prototype.getUnitPrice.call(resultList[k]) * Goods.prototype.getCount.call(resultList[k]) * 100)/100;
					result.save = 0;
					result.name = Goods.prototype.getName.call(resultList[k]);
					result.unitPrice = Goods.prototype.getUnitPrice.call(resultList[k]) + '元';
					result.count = Goods.prototype.getCount.call(resultList[k]);
					result.category = Goods.prototype.getCategory.call(resultList[k]);
					result.isfullCutArray = false;
					result.isDiscount = false;
					result.freeCount = 0;
				}
				finalList.push(result);
			}

			for(var j = 0; j < finalList.length;j++){
				var goodsContent = '';
				var freeContent = '';
				totalPrice += finalList[j].total;
				if(finalList[j].isfullCutArray){
					fullCutArrayFlag = true;
					globalFlag = true;
					goodsContent = '名称: ' + finalList[j].name + ', 数量：' + finalList[j].count + finalList[j].category + ', 单价：' + finalList[j].unitPrice + ', 小计：' + finalList[j].total + '(元)\n';
					commonContent += goodsContent;

					freeContent = '名称：' + finalList[j].name + ', 数量:' + finalList[j].freeCount + finalList[j].category + '\n';
					fullCutArrayContent += freeContent;
					savePrice += finalList[j].save;
				}else if(finalList[j].isDiscount){
					globalFlag = true;
					goodsContent = '名称: ' + finalList[j].name + ', 数量：' + finalList[j].count + finalList[j].category + ', 单价：' + finalList[j].unitPrice + ', 小计：' + finalList[j].total + '(元), 节省' + finalList[j].save + '(元)\n';
					commonContent += goodsContent;
					savePrice += finalList[j].save;
				}else{
					goodsContent = '名称: ' + finalList[j].name + ', 数量：' + finalList[j].count + finalList[j].category + ', 单价：' + finalList[j].unitPrice + ', 小计：' + finalList[j].total + '(元)\n';
					commonContent += goodsContent;
				}
			}
			totalPrice = Math.round(totalPrice * 100)/100;
			savePrice = Math.round(savePrice * 100)/100;

			commonContent += '------------------------------\n';//商品通用记录结束

			//添加买二免一商品记录
			if(fullCutArrayFlag){
				fullCutArrayContent += '------------------------------\n';//买二免一记录结束
				commonContent += fullCutArrayContent;
			}

			//添加总计和节省记录
			commonContent += '总计：' + totalPrice + '(元)\n';
			if(globalFlag){
				commonContent += '节省：' + savePrice + '(元)\n';
			}
			commonContent += '******************************\n';//总计和节省记录结束
			return commonContent;	

		};
	};
	

	CashRegister.prototype.getOrderList = function(){
		var resultList = this._exec();
		if(resultList.length){
			return this._printGoodsList(resultList);
		}else{
			return '';
		}	
	};


	Array.prototype.contains = function(value){
		for(i in this){
			if(this[i] == value) return true;
		}
		return false;
	};

	window.CashRegister = window.CashRegister || CashRegister;

})(window);