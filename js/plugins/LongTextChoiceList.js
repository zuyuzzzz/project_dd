// LongTextChoiceList.js
// Created on 10/3/2018
// Last modified on 10/5/2018 by Yethwhinger

var objYeth = objYeth || {};

/*:
* @plugindesc This plugin is meant to allow the use of choices
* with a lot of text in the Show Choices command.
* @author Yethwhinger
*
* @help This plugin allows choices in the Show Choices event
* command to have text that occupies more than a single line.
* The plugin automatically splits long choice text into multiple
* lines if the text will not fit in the choice window. Manual
* line breaks can also be inserted by entering '\n' in the
* choice text.
*/

//------------------------------
// Changes to Window_ChoiceList
//------------------------------

objYeth.Window_ChoiceList_initializeLong = Window_ChoiceList.prototype.initialize;
Window_ChoiceList.prototype.initialize = function (messageWindow) {
    this._choices = [];
    objYeth.Window_ChoiceList_initializeLong.call(this, messageWindow);
};

objYeth.Window_ChoiceList_startLong = Window_ChoiceList.prototype.start;
Window_ChoiceList.prototype.start = function () {
    this.resetChoices();
    objYeth.Window_ChoiceList_startLong.call(this);
};

Window_ChoiceList.prototype.resetChoices = function () {
    var nChoices = $gameMessage._choices.length;
    var i, j;
    var choice = {};
    var maxWidth = Graphics.boxWidth - 2 * this.textPadding() - 2 * this.standardPadding();
    var text;
    var wChoice;
    var row = 0;
    var nLines, newLength;
    var autoLines, frontArray, backArray;
    this._choices = [];
    this._numLines = 0;
    for (i = 0; i < nChoices; i++) {
        choice.row = row;
        text = $gameMessage._choices[i];
        choice.lines = text.split('\\n');
        nLines = choice.lines.length;
        for (j = 1; j < nLines; j++) {
            choice.lines[j] = ' ' + choice.lines[j];
        }
        for (j = 0; j < nLines; j++) {
            text = choice.lines[j];
            wChoice = this.textWidthEx(text);
            if (wChoice > maxWidth) {
                autoLines = this.makeChoiceLines(text);
                newLength = autoLines.length;
                frontArray = choice.lines.slice(0, j);
                backArray = choice.lines.slice(j + 1);
                frontArray = frontArray.concat(autoLines);
                choice.lines = frontArray.concat(backArray);
                nLines += newLength - 1;
                j += newLength - 1;
            }
        }
        this._choices[i] = choice;
        this._numLines += choice.lines.length;
        row = this._numLines;
        choice = {};
    }
};

Window_ChoiceList.prototype.makeChoiceLines = function (text) {
    var maxWidth = Graphics.boxWidth - 2 * this.textPadding() - 2 * this.standardPadding();
    var textArray = text.split(' ');
    var nWords = textArray.length;
    var strStart = textArray[0];
    var strTest = strStart;
    var i = 1;
    var lines = [];
    var j = 0;
    for (i = 1; i < nWords; i++) {
        strTest += ' ' + textArray[i];
        if (this.textWidthEx(strTest) < maxWidth) {
            strStart = strTest;
        }
        else {
            lines[j] = strStart;
            j++;
            strStart = ' ' + textArray[i];
            strTest = strStart;
        }
    }
    lines[j] = strStart;
    return lines;
};

Window_ChoiceList.prototype.numVisibleRows = function () {
    var messageY = this._messageWindow.y;
    var messageHeight = this._messageWindow.height;
    var centerY = Graphics.boxHeight / 2;
    var maxLines = 8;
    var numLines = this._numLines;
    if (messageY < centerY && messageY + messageHeight > centerY) {
        maxLines = 4;
    }
    if (numLines > maxLines) {
        numLines = maxLines;
    }
    return numLines;
};

Window_ChoiceList.prototype.itemHeight = function (index) {
    var choice = this._choices[index];
    var h;
    if (choice) {
        h = this.lineHeight() * choice.lines.length;
    }
    return h;
};

Window_ChoiceList.prototype.row = function () {
    var row = 0;
    var choice = this._choices[this.index()];
    if (choice) {
        row = choice.row;
    }
    return row;
};

Window_ChoiceList.prototype.maxRows = function () {
    return this._numLines;
};

Window_ChoiceList.prototype.topRow = function () {
    return Math.floor(this._scrollY / this.lineHeight());
};

Window_ChoiceList.prototype.setTopRow = function (row) {
    var scrollY = row.clamp(0, this.maxTopRow()) * this.lineHeight();
    if (this._scrollY !== scrollY) {
        this._scrollY = scrollY;
        this.refresh();
        this.updateCursor();
    }
};

Window_ChoiceList.prototype.topIndex = function () {
    var lastIndex = this.maxItems() - 1;
    var topRow = this.topRow();
    var i;
    var topIndex = lastIndex;
    for (i = lastIndex; i > 0; i--) {
        if (this._choices[i].row > topRow) {
            topIndex = i - 1;
        }
    }
    return topIndex;
};

Window_ChoiceList.prototype.maxPageRows = function () {
    var pageHeight = this.height - this.padding * 2;
    return Math.floor(pageHeight / this.lineHeight());
};

Window_ChoiceList.prototype.updateCursor = function () {
    if (this._cursorAll) {
        var allRowsHeight = this.contentsHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

Window_ChoiceList.prototype.isCursorVisible = function () {
    var row = this.row();
    var topRow = this.topRow();
    var hChoice = 1;
    var choice = this._choices[this.index()];
    var visible = false;
    if (choice) {
        hChoice = choice.lines.length;
    }
    if ((row + hChoice - 1) >= topRow && row <= this.bottomRow()) {
        visible = true;
    }
    return visible;
};

Window_ChoiceList.prototype.ensureCursorVisible = function () {
    var row = this.row();
    var choiceBottom;
    var hChoice = 1;
    var choice = this._choices[this.index()];
    if (choice) {
        hChoice = choice.lines.length;
    }
    choiceBottom = row + hChoice - 1;
    if (row < this.topRow()) {
        this.setTopRow(row);
    } else if (choiceBottom > this.bottomRow()) {
        this.setBottomRow(choiceBottom);
    }
};

Window_ChoiceList.prototype.itemRect = function (index) {
    var rect = new Rectangle();
    var i;
    rect.width = this.itemWidth();
    rect.height = this.itemHeight(index);
    rect.x = -this._scrollX;
    rect.y = -this._scrollY;
    for (i = 0; i < index; i++) {
        rect.y += this.itemHeight(i);
    }
    return rect;
};

Window_ChoiceList.prototype.maxChoiceWidth = function () {
    var maxWidth = 96;
    var choices = this._choices;
    var nChoices = choices.length;
    var allLines = [];
    var i, choiceWidth;
    var numLines = this._numLines || 0;
    for (i = 0; i < nChoices; i++) {
        allLines = allLines.concat(choices[i].lines);
    }
    for (i = 0; i < numLines; i++) {
        choiceWidth = this.textWidthEx(allLines[i]) + this.textPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};

Window_ChoiceList.prototype.contentsHeight = function () {
    var maxItems = this.maxItems();
    var i;
    var h = 0;
    for (i = 0; i < maxItems; i++) {
        h += this.itemHeight(i);
    }
    return h;
};

Window_ChoiceList.prototype.drawItem = function (index) {
    var lines = this._choices[index].lines;
    var nLines = lines.length;
    var hLine = this.lineHeight();
    var rect = this.itemRectForText(index);
    var textLine;
    var i;
    var y = rect.y;
    for (i = 0; i < nLines; i++) {
        textLine = lines[i];
        this.drawTextEx(textLine, rect.x, y);
        y += hLine;
    }
};