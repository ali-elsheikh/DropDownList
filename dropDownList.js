const dropDownList = {
    init: function (initObject) {
        initObject = dropDownList.getInitObject(initObject);
        dropDownList.createDdlHtml(initObject);
    },
    getInitObject: function (_initObject) {
        let initObject = {};
        initObject.containerDivId = typeof _initObject.containerDivId == 'string' ? _initObject.containerDivId : '';
        initObject.hasSearch = typeof _initObject.hasSearch == 'boolean' ? _initObject.hasSearch : false;
        initObject.dataKey = typeof _initObject.dataKey == 'string' ? _initObject.dataKey : 'key';
        initObject.dataValue = typeof _initObject.dataValue == 'string' ? _initObject.dataValue : 'key';
        initObject.data = _initObject.data && _initObject.data.constructor == Array ? _initObject.data : [{ key: "-1", value: "NULL" }];
        initObject.isMultiple = typeof _initObject.isMultiple == 'boolean' ? _initObject.isMultiple : false;
        initObject.isTreeView = typeof _initObject.isTreeView == 'boolean' ? _initObject.isTreeView : false;
        return initObject;
    },
    createDdlHtml: function (initObject) {
        let containerDiv = document.getElementById(initObject.containerDivId);
        if (containerDiv) {
            containerDiv.initObject = initObject;

            let dropDownListContainer = dropDownList.createElement({
                tagName: "div",
                classList: "drop-down-list-body"
            });

            let dropDownFirstDiv = dropDownList.createElement({
                tagName: "div",
                id: "div_" + initObject.containerDivId + "_Ddl",
                classList: "drop-down-list-header",
                clickTargetId: "ddl_" + initObject.containerDivId + "_optionsContainer",
                onclick: function () {
                    document.getElementById(this.clickTargetId).classList.toggle("drop-down-list-open")
                }
            });

            let dropDownLbl = dropDownList.createElement({
                tagName: "span",
                id: "lbl_" + initObject.containerDivId + "_slctd",
                innerText: initObject.data[0][initObject.dataValue]
            });

            dropDownFirstDiv.appendChild(dropDownLbl);
            dropDownListContainer.appendChild(dropDownFirstDiv);
            dropDownListContainer.appendChild(dropDownList.createOptions(initObject.data, initObject));

            containerDiv.appendChild(dropDownListContainer);

        }
    },
    createOptions: function (data, initObject) {
        let optionsContainer = dropDownList.createElement({
            tagName: "div",
            id: "ddl_" + initObject.containerDivId + "_optionsContainer",
            isMultiple: initObject.isMultiple,
            isTreeView: initObject.isTreeView,
            classList: "drop-down-list-open"
        });
        document.onclick = function (e) {
            let target = e.target;
            while (target.parentNode) {
                if (target == optionsContainer) return;
                target = target.parentNode;
            }
            optionsContainer.classList.toggle("drop-down-list-open");
        };
        if (initObject.hasSearch) {
            let txtSearch = dropDownList.createElement({
                tagName: "input", type: "text",
                placeholder: "search",
                containerId: initObject.containerDivId
            });
            txtSearch.addEventListener("keyup", dropDownList.filterFunction);
            optionsContainer.appendChild(txtSearch);
        }
        let optionsList = dropDownList.createElement({
            tagName: "ul",
            classList: "drop-down-list-ul"
        });
        for (let i = 0; i < data.length; i++) {

            let listItem = dropDownList.createElement({
                tagName: "li",
                data: data[i],
                containerId: optionsContainer.id,
                onclick: function () {
                    dropDownList.select(this);
                }
            });

            let listItemInnerDiv = dropDownList.createElement({ tagName: "div" });

            //if (initObject.isMultiple) {
            //    let listItemCB = dropDownList.createElement({
            //        tagName: "input",
            //        type: "checkbox"
            //    });
            //    listItemInnerDiv.appendChild(listItemCB);
            //}

            let listItemText = dropDownList.createElement({
                tagName: "span",
                innerText: data[i][initObject.dataValue]
            });

            listItemInnerDiv.appendChild(listItemText);
            listItem.appendChild(listItemInnerDiv);
            if (i == 0)
                listItem.classList = "drop-down-list-selected";
            optionsList.appendChild(listItem);
        }
        optionsContainer.appendChild(optionsList);
        return optionsContainer;
    },
    createElement: function (element) {
        let domElement = document.createElement(element.tagName);
        for (let prop in element) {
            domElement[prop] = element[prop];
        }
        return domElement;
    },
    filterFunction: function (event) {
        let searchText = event.target.value;
        let container = document.getElementById(event.target.containerId);
        Array.from(container.getElementsByTagName("li")).forEach(function (e) {
            e.style.display = (searchText == "" || e.innerText.toLowerCase().includes(searchText))
                ? "" : "none";
        });
    },
    hidBodyOnClickOut: function (event) {
        let target = event.target;
        while (target.parentNode.classList.includes("")) {

        }
    },
    select: function (element) {
        let optionsContainer = document.getElementById(element.containerId);
        if (optionsContainer && !optionsContainer.isMultiple)
            Array.from(document.getElementsByClassName("drop-down-list-selected")).forEach(element => element.classList.remove("drop-down-list-selected"));;
        element.classList.toggle("drop-down-list-selected");
        if (optionsContainer && !optionsContainer.isMultiple)
            optionsContainer.classList.toggle("drop-down-list-open");
    },
    get: function (dropDown) {
        return Array.from(document.getElementById(dropDown)
            .getElementsByClassName("drop-down-list-selected"))
            .map(element => element.data);
    }
}