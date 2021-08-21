//////////////////////////// [TODO LIST] ////////////////////////////
/*





*/
//////////////////////////////////////////////////////////////////////


let IS_DEVELOPMENT = 0
const DATABASE_VERSION = "1.0.0"
let BASE_URL = "https://development.eveapp2021.workers.dev/"

if (!IS_DEVELOPMENT)
  BASE_URL = "https://production.eveapp2021.workers.dev/"

if (location.hostname == "127.0.0.1" || location.hostname == "localhost")
  IS_DEVELOPMENT = 1


class Record {
  constructor({id, contentType, content = "", clozes = [], occlusions = [], url = "", priority = 66} = {}) {

    let record = {
      "id": id,
      "priority": priority,
      "contentType": contentType,
      "repetition": 0,
      "totalRepetitionCount": 0,
      "isFlagged": false,
      "interval": 1, // SM-2 algo
      "efactor": 2.5, // SM-2 algo
      "dueDate": new Date().toJSON() // SM-2 algo (dueDate is the date the next time when the item should be reviewed.)
    }

    if(contentType == "Folder") {

    } else if(contentType == "Cloze") {
      
      record.content = content
      record.clozes = clozes

    } else if (contentType == "Extract") {

      record.content = content

    } else if (contentType == "Image") {
      // 
    } else if (contentType == "Occlusion") {

      record.url = url // URL for image name in BB
      record.occlusions = occlusions

    }

    return record
  }
}

class Cloze {
  constructor(cloze, startindex, stopindex) {
    return {
      cloze: cloze,
      startindex: startindex,
      stopindex: stopindex,
    }
  }
}

class Occlusion {
  constructor(x, y, width, height) {

    return {
      x: x,
      y: y,
      width: width,
      height: height
    }

  }
}


class PriorityQueue {

  constructor() {

  }

  static getPriorityQueue() {

    // Get all items due today

    let res = databaseManager.database.items.filter(
      (r => r.contentType == "Cloze" ||
      r.contentType == "Extract" ||
      r.contentType == "Occlusion").sort((a, b) => a.dueDate - b.dueDate)
    )

    console.log(res)
    return res

  }

}



class Profile {
  constructor() {

    return {
      "version": DATABASE_VERSION,
      "id": 0,
      "reviewsTotalCount": 0,
      "dueCount": 0,
      "folderCount": 0,
      "extractCount": 0,
      "clozeCount": 0,
      "occlusionCount": 0,
      "isDatabasePublic": true,
      "tutorialCompleted": false,

      "mainWindowPadding": 8,
      "leftSidebarPadding": 8,
      "rightSidebarPadding": 8,

      "showLeftSidebar": true,
      "showRightSidebar": true,
      "showExtractsInLearningMode": true,
      "showOcclusionsInLearningMode": true,
      "showClozesInLearningMode": true,
      "showImagesInSidebar": true,

      "mainWindowBackgroundColor": "#0000",
      "mainWindowFontColor": "#0000",
      "leftSidebarBackgroundColor": "#0000",
      "rightSidebarBackgroundColor": "#0000",
      "extractHighlightColor": "#f9ff24", //"249, 255, 36, 0.8",
      "clozeHighlightColor": "#73b9ff", //"115, 185, 255, 0.7",


      "showToolbar": true,
      "theme": "day",

      "acceptedPolicy": false,
      "statistics": {
        "2021-01-01": {
          "reviewsCount": 0,
          "newItemsCount": 0
        }
      },
      "shortcuts": [
        {event: "input-create-occlusion", keyCode: 90, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + Z"},
        {event: "input-create-occlusion-separate", keyCode: 188, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + <"},
        {event: "input-show-occlusion", keyCode: 32, altKey: false, metaKey: false, ctrlKey: false, shift: false, combination: "SPACE"},
        {event: "input-create-cloze", keyCode: 67, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + C"},
        {event: "input-create-extract", keyCode: 88, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + X"},
        {event: "input-spotlight-toggle", keyCode: 32, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + SPACE"},
        {event: "input-text-summarize", keyCode: 71, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + G"},
        {event: "input-flag-item", keyCode: 70, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + F"},

        {event: "input-remove-item", keycode: 90, altKey: true, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + ALT + Z"},
        {event: "input-rename-item", keycode: 88, altKey: true, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + ALT + X"},
        {event: "input-duplicate-item", keycode: 68, altKey: true, metaKey: false, ctrlKey: true, shift: false, combination: "CTRL + ALT + D"},
        {event: "input-create-folder", keycode: 67, altKey: true, metaKey: true, ctrlKey: true, shift: false, combination:"CTRL + ALT + C"},
        {event: "input-create-text", keycode: 83, altKey: true, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + ALT + S"},

        {event: "input-grade-item1", keyCode: 49, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + 1"},
        {event: "input-grade-item2", keyCode: 50, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + 2"},
        {event: "input-grade-item3", keyCode: 51, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + 3"},
        {event: "input-grade-item4", keyCode: 52, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + 4"},
        {event: "input-grade-item5", keyCode: 53, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + 5"}
      ]
    }
  }

}


class ProfileManager {
  constructor() {
    this.update()
  }

  async logout() {

    await localforage.clear()
    location.reload()

  }

  onShortcutKeyDown(event, element) {

    event.preventDefault()

    let shortcutisAvailable = databaseManager.database.profile.shortcuts.filter(
      r => r.keyCode == event.keyCode &&
            r.altKey == event.altKey &&
            (r.metaKey == event.metaKey ||
            r.ctrlKey == event.ctrlKey)).length == 0 ? true : false


    if(shortcutisAvailable) {

  
      let r = databaseManager.database.profile.shortcuts.find(s => s.event == element.id)
      r.combination = ""

      if(event.altKey) {r.combination += "ALT + "}
      if(event.metaKey) {r.combination += "CMD + "}
      if(event.ctrlKey) {r.combination += "CTRL + "}
      if(event.shiftKey) {r.combination += "SHIFT + "}

      r.combination += event.key.toUpperCase()
      r.keyCode = event.keyCode
      r.altKey = event.altKey
      r.metaKey = event.metaKey
      r.ctrlKey = event.ctrlKey
      r.shiftKey = event.shiftKey

      element.value = r.combination
    
    } else {
      graphicsManager.toggleAlert("Keyboard shortcut is already used, try another shortcut.", "warning")
    }

  }

  update() {

    databaseManager.database.profile.id = databaseManager.getDatabaseID()
    databaseManager.database.profile.reviewsTotalCount  = databaseManager.getTotalReviewsCount()
    databaseManager.database.profile.dueCount  = databaseManager.getDueCount()
    databaseManager.database.profile.folderCount  = databaseManager.getFolderCount()
    databaseManager.database.profile.extractCount  = databaseManager.getExtractCount()
    databaseManager.database.profile.clozeCount  = databaseManager.getClozeCount()
    databaseManager.database.profile.occlusionCount  = databaseManager.getOcclusionCount()
    this.render()

  }

  render() {

    // Render shortcuts from database.
    document.getElementById("input-spotlight-toggle").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-spotlight-toggle").combination
    document.getElementById("input-create-cloze").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-cloze").combination
    document.getElementById("input-create-occlusion").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-occlusion").combination
    document.getElementById("input-create-occlusion-separate").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-occlusion-separate").combination
    document.getElementById("input-show-occlusion").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-show-occlusion").combination
    document.getElementById("input-create-extract").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-extract").combination
    document.getElementById("input-text-summarize").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-text-summarize").combination
    document.getElementById("input-flag-item").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-flag-item").combination

    document.getElementById("input-remove-item").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-remove-item").combination
    document.getElementById("input-rename-item").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-rename-item").combination
    document.getElementById("input-duplicate-item").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-duplicate-item").combination
    document.getElementById("input-create-folder").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-folder").combination
    document.getElementById("input-create-text").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-text").combination

    document.getElementById("input-grade-item1").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item1").combination
    document.getElementById("input-grade-item2").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item2").combination
    document.getElementById("input-grade-item3").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item3").combination
    document.getElementById("input-grade-item4").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item4").combination
    document.getElementById("input-grade-item5").value = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item5").combination

    document.getElementById("modalbox-profile-username").innerHTML =   databaseManager.database.profile.id
    document.getElementById("modalbox-profile-reviewsTotalCount").innerHTML = databaseManager.database.profile.reviewsTotalCount;
    document.getElementById("modalbox-profile-dueCount").innerHTML = databaseManager.database.profile.dueCount;
    document.getElementById("modalbox-profile-folderCount").innerHTML = databaseManager.database.profile.folderCount;
    document.getElementById("modalbox-profile-extractCount").innerHTML = databaseManager.database.profile.extractCount;
    document.getElementById("modalbox-profile-clozeCount").innerHTML = databaseManager.database.profile.clozeCount;
    document.getElementById("modalbox-profile-occlusionCount").innerHTML = databaseManager.database.profile.occlusionCount;

    document.getElementById("extract-selection-color-picker").value = databaseManager.database.profile.extractHighlightColor
    document.getElementById("cloze-selection-color-picker").value = databaseManager.database.profile.clozeHighlightColor

    // Set button design 
    const eCheckbox = document.getElementById("modalbox-settings-learning-extracts-checkbox")
    const oCheckbox = document.getElementById("modalbox-settings-learning-occlusions-checkbox")
    const cCheckbox = document.getElementById("modalbox-settings-learning-clozes-checkbox")
    
    if (databaseManager.database.profile.showExtractsInLearningMode)
      eCheckbox.checked = true
    else
      eCheckbox.checked = false

    if (databaseManager.database.profile.showOcclusionsInLearningMode)
      oCheckbox.checked = true
    else 
      oCheckbox.checked = false

    if (databaseManager.database.profile.showClozesInLearningMode)
      cCheckbox.checked = true
    else
      cCheckbox.checked = false




    const imgCheckbox = document.getElementById("modalbox-settings-ui-sidebar-image-checkbox")
    if (databaseManager.database.profile.showImagesInSidebar) 
      imgCheckbox.checked = true
    else
      imgCheckbox.checked = false

    const showRightSidebar = document.getElementById("modalbox-settings-ui-sidebar-show-checkbox")
    if (databaseManager.database.profile.showRightSidebar)
      showRightSidebar.checked = true
    else
      showRightSidebar.checked = false

    const publicChecked = document.getElementById("modalbox-settings-database-shared-checkbox")
    if (databaseManager.database.profile.isDatabasePublic)
      publicChecked.checked = true
    else
      publicChecked.checked = false   

  

  }

}

// Manager to push, remove and handle database.
class DatabaseManager {

  constructor(id = createID(6)) {
      let ref = this
      this.timer = setInterval(this.onTick, 15 * 1000, ref);
      this.id = id;
      this.lastSaved = new Date().toJSON()
      this.database = {
          "profile": new Profile(),
          "items" : [
              new Record({
                id: "Quick start",
                contentType: "Extract",
                content: {
                  "ops": [
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Welcome to Eve!"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "This is an alpha release which does mean that the product may consist of bugs here and there. Therefore there are a few things you need to know: when working in Eve please do export the database frequently via the profile page. This means that you will save all your content on your local store which you will be able to import later on if something goes wrong. The platform has only been tested on Safari and Chrome, avoid internet explorer when using Eve. If you find any bugs please report them asap for us to fix them as fast as possible. This can be done via the bugs channel. Any recommendation for a new feature? Then there is a suggestions channel for this. "
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Quick start:"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Write down the ID, this works as a password. There is no need for a mail"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. When you are logged in, go to the shortcut pages via the face in the top right corner and press shortcuts. Here you will see all shortcuts and for changing a shortcut just press the new keyboard combination"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "3. Now go to the main window and you can start processing your content. If you want image occlusion just drag and drop an image to the window and start to draw rectangles and press the shortcut for generating an image occlusion (can be found in the shortcut window)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "4. Start training will go through all your collection (images, extract, and clozes) with SM-2 algorithm. Use the spacebar as default to show the answer and CTRL + 1 - 5 to rate the card from very hard to very easy."
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Functions currently supported:"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Cloze deletions"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Image occlusions"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Incremental reading"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Similar content (parsing words from Oxford and articles from Wikipedia)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Profile (Cards due, total repetitions)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Customizable keyboard shortcuts"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Export database"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Import database"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Zen Mode"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Dark Mode"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Learning mode"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- SM-2 for image occlusions and clozes"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "- Information structure with folders fully customizable"
                    },
                    {
                      "insert": "\n\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Q: What is EVE?"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "A: Eve is specifically tailored for evidence-based effective studying with help of evidence-based methods such as spaced repetition (SM2), interleaved practice, and incremental reading."
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Q: How do I come in contact?"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "A: Send us a message on Discord (MirrorNeuron#1929) or join our channel: https://discord.gg/2xkMPmcGZh."
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Q: How do I report a bug?"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "A: Please do post it in the bugs channel at Discord."
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Q: How do I suggest a feature?"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "A: Send a message on the suggestion channel at Discord."
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Q: How is Eve different from SuperMemo?"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "A: Eve is web-based which means it will run on all systems (even the smartphone). In regards to the algorithm, Eve is using SM2 instead of SM18 which probably will make some difference in lifelong learning and especially when there is a lot of information in the database. There is also a function in Eve which is called \"Similar content\" which means that for each selected word it will send a request to Oxford and Wikipedias API to extract the meaning of the word and similar related concepts. This is great because it will help the user with the coherence of the concept."
                    },
                    {
                      "insert": "\n\n\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to make an image occlusion"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Drop an image in the main working window"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. Start to drag on the window to create occlusions"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "3. When all occlusions are done, press your shortcut (default: CTRL + Z)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "4. Now you will see the image in the left sidebar"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to make a cloze"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Select the text you want to make a cloze of in the main working window"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. Press the shortcut for closure (default: CTRL + C)"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to make a text extract for IR (incremental reading)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Select the text you want to extract from the main working window"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. Press the shortcut for text extraction (default: CTRL + X)"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to rename an item (folder, image, or extract)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Right-click on the item in the left sidebar "
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. Select the renamed item and enter the name in the input"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to remove an item from the information tree"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Right-click on the item and press remove"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to create a folder"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Right-click on the folder you want to make a folder in"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. Select create folder and enter the name of the folder in the input field"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "How to create an empty text document"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Right-click in the left sidebar on an item and press create text"
                    },
                    {
                      "insert": "\n\n\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "Layout"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "The layout consists of one sidebar to the left, one main working window in the middle, a sidebar to the right, and a header."
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "The header"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. Profile /settings (Due count, Cloze count, Folder count, export and import database)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. Zen mode (remove distractions and keep only necessary things visible)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "3. Dark mode"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "The left sidebar"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "1. The engage button is used for training with help of SM-2. It will start and shuffle through your content (images, clozes, and extracts). You will press space to show the answer then grade how well you remember the item with (default CTRL + 1 - 5) and then it will show you the next item."
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "2. The information tree consists of all your content (images, closures, and extracts)"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "3. The context menu. Right-click on an item and you will see a menu"
                    },
                    {
                      "insert": "\n\n"
                    },
                    {
                      "attributes": {
                        
                        "bold": true
                      },
                      "insert": "The right sidebar:"
                    },
                    {
                      "insert": "\n"
                    },
                    {
                      "attributes": {
                        
                      },
                      "insert": "This area is used for a similar context. It will in realtime make an image search and context search to find similar information as the word you have currently highlighted. If you hover the text or images on the right sidebar it will display the image as zoomed in and the text when hovering"
                    }
                  ]
                }
              }),
              new Record({
                id: "Folder1",
                contentType: "Folder",
              }),
              new Record({
                id: "Folder2",
                contentType: "Folder",
              }),
              new Record({
                id: "Folder2/Folder3",
                contentType: "Folder",
              }),
              new Record({
                id: "Folder2/Folder4",
                contentType: "Folder",
              }),
              new Record({
                id: "Folder2/Folder4/Folder5",
                contentType: "Folder",
              }),
          ],
      }
  }

  onTick(ref) {

    if(ref.loggedIn) {
      databaseManager.saveLocalDatabase()
      graphicsManager.onTick()
    }

  }

 
  getDatabaseID() {
    return this.id
  }
 
  async getDatabaseByID(id) {


      let r = await fetch(BASE_URL + id + ".json")
      if(r.ok) {
  
        let jsonDatabase = await r.json()
        return jsonDatabase

      } else {
          
        
          return {}
        
        }
        

  }

  setItemFlag(flagged){

    const id = graphicsManager.lastRightClickedItemID
    if (id != null && id != -1) {

      let r = this.getRecordByID(id)
      if (r !== undefined){

        this.flagItemByID(id, flagged)

      }

    } else {

      graphicsManager.toggleAlert("Can not flag/unflag item.", "warning")

    }

  }
  flagItemByID(id, flagged) {

    let r = this.getRecordByID(id) 
    if (r !== undefined) {

        r.isFlagged = flagged
        console.log(r.isFlagged)
        if (flagged)
          r.dueDate = new Date(r.dueDate).addDays(3).toJSON()

        graphicsManager.renderFolders()
        graphicsManager.expandAllParentsToID(r.id)

        if (flagged)
          graphicsManager.toggleAlert("Item has been flagged and delayed with 3 days.", "success")
        else 
          graphicsManager.toggleAlert("Item has been unflagged.", "success")
        
    } else {

      graphicsManager.toggleAlert("Can not flag/unflag current item.", "warning")

    }

  }

  addImageOcclusions(separateOcclusions, id, occlusions = []) {

    // Check if image is visible, then display.
    if (document.getElementById("modalbox-occlusion-create").classList.contains("visible")) {

      let itemID = -1
      if(separateOcclusions) {

        let r = databaseManager.getRecordByID(graphicsManager.lastMenuItemClicked)
        if (r != null) {

          if (r.contentType == "Folder" || r.contentType == "Extract") {

            occlusions.forEach(occlusion => {

              itemID = r.id + "/" + createID(4) + "-" + id
              this.database.items.push(new Record({
                id: itemID,
                url: id,
                contentType: "Occlusion",
                occlusions: [occlusion]
              }))
            })

          }

        } else { 

          occlusions.forEach(occlusion => {
            itemID = createID(4) + "-" + id
            this.database.items.push(new Record({
              id: itemID,
              url: id,
              contentType: "Occlusion",
              occlusions: [occlusion]
            }))
          })
        
        }

      } else {  


        let r = databaseManager.getRecordByID(graphicsManager.lastMenuItemClicked)
        if (r != null) {

          if (r.contentType == "Folder" || r.contentType == "Extract") {

            // Place image occlusions in selected folder.
            itemID = r.id + "/" + createID(4) + "-" + id
            this.database.items.push(new Record({
            id: itemID,
            url: id,
            contentType: "Occlusion",
            occlusions: occlusions
            }))
            
          }

        } else {

          // Place image occlusions in root folder.
          itemID = createID(4) + "-" + id
          this.database.items.push(new Record({
            id: itemID,
            url: id,
            contentType: "Occlusion",
            occlusions: occlusions
          }))

        }
      
      }

      console.log(itemID)
      graphicsManager.renderFolders()
      graphicsManager.expandAllParentsToID(itemID)
      graphicsManager.toggleAlert("Image occlusions generated.", "success")


    } else {

      graphicsManager.toggleAlert("No image occlusion visible.", "warning")

    }

  }



  toggleImagesInSidebar() {

    if(this.database.profile.showImagesInSidebar)
      this.database.profile.showImagesInSidebar = false
    else
      this.database.profile.showImagesInSidebar = true
   
  }

  toggleRightSidebar() {

    if(this.database.profile.showRightSidebar)
      this.database.profile.showRightSidebar = false
    else
      this.database.profile.showRightSidebar = true
    
  
  
  }


  // async saveLocalDatabaseOnClose() {


  //   const r = this.getRecordByID(graphicsManager.activeInformationID)
  //   const url = BASE_URL + this.id + ".json"

  //   if (r !== undefined)
  //     r.content = graphicsManager.quill.getContents()

  //   //this.pushAgoliaToRemote()

  //   let database = JSON.stringify(this.database);
  //   let blob = new Blob([database], {type: "application/json"});

  //   navigator.sendBeacon(url, blob)

  // }


  increasePriority(amount) {

  }

  postponeItemID(id, days = 3) {

    let r = this.getRecordByID(id)
    if (r != undefined) {

      if (r.dueDate != null)
        r.dueDate = new Date(r.dueDate).addDays(days).toJSON()
    
      const children = this.getAllChildrenByParentId(id).filter(r => r.id)
      for(const child of children) {
        
        if (child.dueDate != null) 
          child.dueDate = new Date(child.dueDate).addDays(days).toJSON()
          console.log("Child postponed: " + child.dueDate)
        }

      graphicsManager.toggleAlert("Item(s) postponed with " +days+ " days!", "success")
      databaseManager.saveLocalDatabase()
      
    } else {

      graphicsManager.toggleAlert("Can not postpone item(s). Try another item.", "warning")
    
    }
  
  }

  
  postpone(days = 7) {

    const id = graphicsManager.lastRightClickedItemID

    if (id!= null && id != -1) {

      let r = this.getRecordByID(id)
      if (r != undefined) {
  
        if (r.dueDate != null)
          r.dueDate = new Date(r.dueDate).addDays(days).toJSON()
      
        const children = this.getAllChildrenByParentId(id).filter(r => r.id)
        for(const child of children) {
          
          if (child.dueDate != null) 
            child.dueDate = new Date(child.dueDate).addDays(days).toJSON()
            console.log("Child postponed: " + child.dueDate)
          }
  
        graphicsManager.toggleAlert("Item(s) postponed with " +days+ " days!", "success")
        databaseManager.saveLocalDatabase()
        
      } else {
  
        graphicsManager.toggleAlert("Can not postpone item(s). Try another item.", "warning")
      
      }

    } else {

      graphicsManager.toggleAlert("Can not postpone item(s). Try another item.", "warning")

    }

  }

  async getPublicDatabases() {

    
    const username = await localforage.getItem("username")
    const password  = await localforage.getItem("password")

    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Basic ${username}:${password}`)

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    let res = await fetch("https://evecloud.io/public/data", requestOptions)
    let response = await res.json()

    if (response.error && response.error == 403)
      return []
    else 
      return response.databases
    

  }

  updateDatabase(database) {

    if (database.profile.version != undefined) {

      if (database.profile.version != DATABASE_VERSION) {

        database.profile.version = DATABASE_VERSION
        database.profile.changelogViewed = false
        console.log("Database has been updated to version: " + DATABASE_VERSION)

      } else {

        database.profile.changelogViewed = true
        console.log("Database is up to date: " + DATABASE_VERSION)

      }

    } else {

      database.profile.version = DATABASE_VERSION
      database.profile.changelogViewed = false
      console.log("Database (version) set to: " + DATABASE_VERSION + " database has been updated!")
   
    }


    if (database.profile.mainWindowPadding == undefined) {
      database.profile.mainWindowPadding = 4
      console.log("Database (mainWindowPadding) set to: " + database.profile.mainWindowPadding)
    }
    if (database.profile.leftSidebarPadding == undefined) {
      database.profile.leftSidebarPadding = 4
      console.log("Database (leftSidebarPadding) set to: " + database.profile.leftSidebarPadding)
    }
    if (database.profile.rightSidebarPadding == undefined) {
      database.profile.rightSidebarPadding = 4
      console.log("Database (rightSidebarPadding) set to: " + database.profile.rightSidebarPadding)
    }




    if (database.profile.showToolbar == undefined) {
      database.profile.showToolbar = true
      console.log("Database (showToolbar) set to: " + database.profile.showToolbar)
    }

    if (database.profile.theme == undefined) {
      database.profile.theme = "day"
      console.log("Database (theme) set to: " + database.profile.theme)
    }

    if (database.profile.tutorialCompleted == undefined) {
      database.profile.tutorialCompleted = false
      console.log("Database (statistics) set to: " + database.profile.tutorialCompleted)
    }

    if (database.profile.statistics == undefined) {
      database.profile.statistics = {}
      console.log("Database (statistics) set to: {}")
    }

    if (database.profile.changelogViewed == undefined) {
      database.profile.changelogViewed = false
      console.log("Database (changelogViewed) set to: " + database.profile.changelogViewed)
    }

    if (database.profile.windowPadding == undefined) {
      database.profile.windowPadding = 12
      console.log("Database (windowPadding) set to: " + database.profile.windowPadding)
    }

    if (database.profile.showRightSidebar == undefined) {
      database.profile.showRightSidebar = true
      console.log("Database (showRightSidebar) set to: " + database.profile.showRightSidebar)
    }
        
    if (database.items[0].isFlagged == undefined)  {
      database.items.find(r => r.isFlagged = false)
      console.log("Database (isFlagged) set to false.")
    }

    if (database.profile.acceptedPolicy == undefined) {
      database.profile.acceptedPolicy = false
      console.log("Database (acceptedPolicy) set to false.")
    }

    let l = database.profile.shortcuts.find(s => s.event == "input-flag-item")
    if (l == undefined) {
      
      database.profile.shortcuts.push({event: "input-flag-item", keyCode: 70, altKey: false, metaKey: true, ctrlKey: true, shift: false, combination: "CTRL + F"})
      console.log("Database (isFlagged) set to false")

    }

    return database

  }

  encrypt(word, key = databaseManager.id) {

    let encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key).toString()
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData

  }


  decrypt(word, key = databaseManager.id) {

    let decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8)
    let bytes = {}
    try {

       bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8)
    
      } catch (error) {

      console.log(error)

    }

    return bytes

  }

  isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
  }

  async userExistByID(username) {

    let response = await fetch(BASE_URL + username + ".json")
    if(response.ok) {

      let res = await response.text()
      if (res.includes("status")) {

        return false

      } else {

        return true

      }

    } else {

      return null

    }

  }

  async register(username, password) {

    document.getElementById("modalbox-login").classList.remove("visible");
    document.getElementById("modalbox-login").classList.add("hidden");

    document.getElementById("overlay").classList.remove("visible");
    document.getElementById("overlay").classList.add("hidden");

    if(!IS_DEVELOPMENT) {
      await graphicsManager.triggerPolicy()
      await graphicsManager.triggerTutorial()
    }

    
    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Basic ${username}:${password}`)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };

    let res = await fetch("https://evecloud.io/user/register", requestOptions)
    let registerMessage = await res.json()

    if (registerMessage.error == 420) {
      graphicsManager.toggleAlert("This username is already taken. Try another one.", "warning")
    } else if (registerMessage.error == 200) {

      graphicsManager.renderFolders() 

      
      await localforage.setItem("username", username)
      await localforage.setItem("password", password)
      
      graphicsManager.toggleAlert("You have now registered.", "success")
      
    }

  }

  async login(username, password) {

    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Basic ${username}:${password}`)

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    let res = await fetch("https://evecloud.io/user/data", requestOptions)
    let response = await res.json()

    if (response.error && response.error == 403) {
      graphicsManager.toggleAlert("You don't have access.", "warning")
      this.register(username, password)
    } else {
      
    
      await localforage.setItem("username", username)
      await localforage.setItem("password", password)


      document.getElementById("modalbox-login").classList.remove("visible");
      document.getElementById("modalbox-login").classList.add("hidden");

      this.id = username
      this.password = password
      this.loggedIn = true
      this.database = this.updateDatabase(response)

      if (!IS_DEVELOPMENT) {
          
           if (this.database.profile.acceptedPolicy == false)
             await graphicsManager.triggerPolicy()

           if (this.database.profile.tutorialCompleted == false)
             await graphicsManager.triggerTutorial()

           document.getElementById("overlay").classList.remove("visible");
           document.getElementById("overlay").classList.add("hidden");

         } else {

           this.database.profile.acceptedPolicy = true
           this.database.profile.tutorialCompleted = true
           document.getElementById("overlay").classList.remove("visible");
           document.getElementById("overlay").classList.add("hidden");

         }



         if (this.database.profile.changelogViewed == false)
          graphicsManager.triggerChangelog()

         graphicsManager.renderFolders() 

        
         let r = this.database.items.find(r => r.contentType == "Extract")
         if(r !== undefined) {
    
           graphicsManager.renderInputBox(r)
           graphicsManager.expandAllParentsToID(r.id)
    
        }

          if(databaseManager.database.profile.showToolbar == false) {
            document.getElementById("ql-").add("hidden")
          }

        setTheme(databaseManager.database.profile.theme)
        document.getElementById("mainwindow-padding-slider").value = databaseManager.database.profile.mainWindowPadding
        document.documentElement.style.setProperty('--mainWindow-padding', databaseManager.database.profile.mainWindowPadding + "px");
        
  
      }

  }
  // async loadSharedDatabase(username, password) {

  //   let response = await fetch(BASE_URL + id + ".json")
  //   if(response.ok) {

  //     let data = await response.text()
  //     if (data.includes("status")) {

  //       return {}

  //     } else if (data.includes("profile")) {

  //       return JSON.parse(data)

  //     } else {

  //       let jsonResponse = JSON.parse(this.decrypt(data, password))
  //       if("profile" in jsonResponse)
  //         return jsonResponse
  //       else
  //         return {}

  //     }

  //   } else {

  //     return {}

  //   }


  // }


  // Import public database to current user.
  async importDatabaseByUsername(username) {

    var myHeaders = new Headers()
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    let res = await fetch("https://evecloud.io/user/data/rere", requestOptions)
    let response = await res.json()

    if (response.error && response.error == 403) {
        graphicsManager.toggleAlert("You don't have access.", "warning")
    } else {
      this.database.data = response
      graphicsManager.toggleAlert("Database has been imported.", "success")
    }

  }


  async saveLocalDatabase() {

    let r = this.getRecordByID(graphicsManager.activeInformationID)
    console.log(r)

    if (r !== null && r !== undefined)   {

      r.content = graphicsManager.quill.getContents()
 
    }

    this.lastSaved = new Date().toJSON()
    //const encryptedData = this.encrypt(this.database, this.password)

    const username = await localforage.getItem("username")
    const password  = await localforage.getItem("password")

    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Basic ${username}:${password}`)
    myHeaders.append("Content-type", `application/json`)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(this.database)
    };

    let res = await fetch("https://evecloud.io/user/data", requestOptions)
    let response = await res.json()

    if (response.error && response.error == 403) {
      graphicsManager.toggleAlert("You don't have access for pushing a db to this username.", "warning")
    }

    graphicsManager.saveLocalDatabase()
    
  }

  deltaToRawText(delta) {

    let parent = document.createElement("div")
    let q = new Quill(document.createElement("div"))

    if (typeof delta === 'string') 
        q.setText(delta)
     else 
        q.setContents(delta)

    parent.innerHTML = q.root.innerHTML
    return q.getText()

}


  async convertImageToWEBP(file) {
    
    return new Promise((resolve, reject) => { 

        let image = new Image()
        image.src = URL.createObjectURL(file)
        image.onload = () => {

          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext("2d")

          canvas.width = image.width
          canvas.height = image.height
          ctx.drawImage(image, 0, 0)

          canvas.toBlob(function (blob) { 

            //resolve(blob)
            //resolve(URL.createObjectURL(blob))
            let file = new File([blob], 'my-new-name.webp', { type: "image/webp" })
            resolve(file)

          }, "image/webp") 
      
        }

    })

  }

  getFileArrayBuffer(file) {

    return new Promise((resolve, reject) => {

      let read = new FileReader()
      read.readAsArrayBuffer(file)
      read.onloadend = function(){

          resolve(read.result)

      }

    })

  }

  uploadFile(file, path = "") {

    return new Promise(async (resolve, reject) => {
      
      let id = ""
      let extension = ""
      let filename = ""

      if (path == "") {

        id = createID(6)
        extension = file.type.split("/")[1]
        filename = id + "." + extension
        path = BASE_URL + filename
    
      }

      const imageDataBuffer = await this.getFileArrayBuffer(file)

      console.log(path)

      document.title = "Eve — Effective learning (uploading...)"

      await fetch(path, {
        method: "POST",
        body: imageDataBuffer,
        headers: new Headers({
          "Content-Type": file.type
        })
      })

      document.title = "Eve — Effective learning"

      // Return filename
      resolve(path.replace(BASE_URL, ""))
      
    })

  }


  async uploadToFile(content, filename, contentType = "application/json") {

    const URL = BASE_URL + filename
    await fetch(URL, {
      method: "POST",
      body: content,
      headers: new Headers({
        "Content-Type": contentType
      })
    })

  }

  downloadToFile (content, filename, contentType = "application/json") {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(a.href);
  }

  readFile(file) {
      return new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = e => {
          resolve(e.target.result);
        };
        fr.readAsText(file)
      })
  }


  async deleteDatabase() {

    const accept = confirm("Are you sure you want to remove this account, this can not be undone.")
    if (accept) {

      const username = await localforage.getItem("username")
      const password = await localforage.getItem("password")

      var myHeaders = new Headers()
      myHeaders.append("Authorization", `Basic ${username}:${password}`)

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
      };

      let res = await fetch("https://evecloud.io/user/delete", requestOptions)
      let response = await res.json()

      if (response.error && response.error == 200) 
        await profileManager.logout()
      else 
        graphicsManager.toggleAlert("Can not remove database.", "warning")
      

    }

  }


  async exportSelectedDatabase(e) {

    const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)

    if (r != null) {

      // Get all items which begins with r.id
      //await this.saveLocalDatabase()
      let children = this.getAllChildrenByParentId(r.id)
      children.push(r)
  
      this.downloadToFile(JSON.stringify(children), r.id+".json")
      graphicsManager.toggleAlert("Selected path has been exported.", "success")

    } else {

      this.exportDatabase()
      graphicsManager.toggleAlert("The full database has been exported.", "success")

    }

  }
  async importSelectedDatabase(e) {


      const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)
      if (r != null) {
        
        this.importDatabase(true, r.id)
        graphicsManager.toggleAlert("Database has been imported to selected path!", "success")

      } else {

        this.importDatabase(true)
        graphicsManager.toggleAlert("Database has been imported!", "success")

      }
    
  }
  async exportDatabase() {
    
    await this.saveLocalDatabase()
    this.downloadToFile(JSON.stringify(this.database), "database.json");

  }

  
  getDateToday() {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let date = yyyy + "-" + mm + "-" + dd
    return date

  }

  async createFreeRecallDocument(clozeList) {

    let path = "Recall/"+getDateToday()+"_"+createID(3)

    if(databaseManager.itemExistByID("Recall") == false)
      databaseManager.createFolder("Recall")

    console.log(clozeList)

    let content = []
    for (const [key, value] of Object.entries(clozeList)) { 

      console.log(key)
      console.log(value)

      value.insert += "↵↵↵"
      value.insert += "\n\n\n"

      content.push({attributes: value.attributes, insert: value.insert})

    }

    console.log(content)

    if (databaseManager.itemExistByID(path) == false)
      databaseManager.createText(path, content)

    learningManager.recallClozeList = []

  }


  importQuizletDatabase() {

    /*
        Sagital plan::Transversalplan
        Skär kroppen i två lika delar "framåt"

        Coronal plan::Frontal
        Skär kroppen i två lika delar "sidled"

        Transverse plan::Horisontellt
        Skär kroppen i midjan "uppåt"

        Os frontale::Pannben

        Os maxilla::Överkäken
        "Kindben"
    */
    let input = document.createElement('input')
    input.setAttribute("accept", ".txt")
    input.type = 'file'

    input.onchange = e => { 

      const fileList = e.target.files
      let fileContent = []
      let reader = new FileReader()

      reader.onload = () =>  {

        fileContent = reader.result.split("\n\n")
        
        for(const row of fileContent) {

          // Check if cloze item
          //if(row.contains("{{c")) {
          this.createText(createID(5), [{ insert: row }])
          //}
          console.log("Row: " + row)
        }
      
      }
      reader.readAsText(fileList[0])

    }
    
    input.click()

  }
  importAnkiDatabase() {

    /*
    {{c2::Stockholm}} är huvudstaden i {{c1::Sverige}}?		
    {{c1::Martin}} är mitt namn.		
    {{c2::Stockholm}} är större än {{c1::Linköping}}		
    Vad heter Sveriges huvudstad?	Stockholm	
    Vad heter Frankrikes huvudstad?	Paris	
    Vad heter Italiens huvudstad?	Rom	
    Vad heter Greklands huvudstad?	Aten	
    */
    let input = document.createElement('input')
    input.setAttribute("accept", ".txt")
    input.type = 'file'

    input.onchange = e => { 

      const fileList = e.target.files
      let fileContent = []
      let reader = new FileReader()

      reader.onload = () =>  {

        fileContent = reader.result.split("\n")
        
        for(const row of fileContent) {

          // Check if cloze item
          //if(row.contains("{{c")) {
          this.createText(createID(5), [{ insert: row }])
          //}
          console.log("Row: " + row)
        }
      
      }
      reader.readAsText(fileList[0])

    }
    
    input.click()

  }
  async importDatabase(onlyItems = false, startsWithID = ""){

    let input = document.createElement('input');
    input.setAttribute("accept", ".json,application/json")
    input.type = 'file';
    input.onchange = e => { 

      let file = e.target.files[0];
      let reader = new FileReader();

      reader.onload = (function(f) {
          return function(e) {

            if(onlyItems) {

              const items = JSON.parse(this.result)
              for (const item of items) {
                
                if(startsWithID !== "") {
                  item.id = startsWithID + "/" +  item.id
                }

                databaseManager.database.items.push(item)
              
              }

            } else {

              const id = createID(6)
              databaseManager.database = JSON.parse(this.result)
              databaseManager.id = id

            }

          graphicsManager.renderFolders()
            
    
          };
      })(file);
      reader.readAsText(file);
    }
    
    input.click();

  }
  async importItemsDatabase(){

  }
  async sha256(message) {

    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
  }


  async makeDatabasePrivate() {

    const username = await localforage.getItem("username")
    const password = await localforage.getItem("password")

    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Basic ${username}:${password}`)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };

    let res = await fetch("https://evecloud.io/user/set/public/false", requestOptions)
    let response = await res.json()

    if (response.error && response.error == 200) {
      databaseManager.database.profile.isDatabasePublic = false
      graphicsManager.toggleAlert("Database has been made private.", "success")
    } else {
      graphicsManager.toggleAlert("Can not make database private.", "warning")
    }
      
  }
  async makeDatabasePublic() {

    const username = await localforage.getItem("username")
    const password = await localforage.getItem("password")

    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Basic ${username}:${password}`)
    console.log(username)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };

    let res = await fetch("https://evecloud.io/user/set/public/true", requestOptions)
    let response = await res.json()
    console.log(response)

    if (response.error && response.error == 200) {
      databaseManager.database.profile.isDatabasePublic = true
      graphicsManager.toggleAlert("Database has been made public.", "success")
    } else {
      graphicsManager.toggleAlert("Error, can not make database public.", "warning")
    }



  }



  async addRecord(record) {

    // Append to statistics + 1.
    learningManager.updateStatisticsItemCount()

    this.database.items.push(record)
    graphicsManager.renderFolders()
    this.saveLocalDatabase()
  }
  removeRecordByID(id) {
    this.database.items = this.database.items.filter(record => record.id != id)
    this.saveLocalDatabase()
  }
  getRecordByID(id){
    return this.database.items.find(record => record.id == id)
  }
  itemExistByID(id) {

    if(this.database.items.filter(r => r.id == id).length > 0)
      return true
    else
      return false

  }



  moveItemID(fromID, toID) {

    if ( databaseManager.getRecordByID(toID + "/" + fromID) == undefined) {

      const parent = this.getRecordByID(fromID)
      const children = this.getAllChildrenByParentId(fromID)
      const selectedNode = parent.id.split("/").pop()

      parent.id = toID + "/" + selectedNode

      if(children.length > 0) {

        for(const child of children) {

          child.id = parent.id + child.id.replace(fromID, "")

        }

      }

    } else {

      graphicsManager.toggleAlert("Item name already used, try another name.", "warning")

    }

  }
  duplicateItem() {

    const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)
    if (r != null) {

      let nItem = new Record(r)
      let arr = nItem.id.split("/")
      let oldPath = arr[arr.length - 1]
      let newID = createID(6)
      nItem.id = nItem.id.replace(oldPath, newID)
      
      this.addRecord(nItem)

      graphicsManager.renderFolders()
      graphicsManager.expandAllParentsToID(r.id)

    } else {
        this.toggleAlert("Can not duplicate this item.")
    }

  }
  createText(id = createID(6), content = [{ insert: 'Enter your content here...' }]) {

    this.addRecord(new Record({
      "id": id,
      "contentType": "Extract",
      "content": content
    }))

  }
  createFolder(folderName) {

    this.addRecord(new Record({
      id: folderName,
      contentType: "Folder",
    }))

  }
  removeItem(id) {

    // Get all children by parent ID
    const children = this.getAllChildrenByParentId(id).map(child => child.id)
    for(const child of children) 
      this.removeRecordByID(child)

    this.removeRecordByID(id)

  }
  renameItem(ID, newID) {

    if (this.getRecordByID(newID) == undefined) {

      let record = this.getRecordByID(ID)
      let children = this.getAllChildrenByParentId(ID)

      let parentArr = ID.split("/")
      let lastPathID = parentArr[parentArr.length - 1]
      let newPathID = ID.replace(lastPathID, newID)

      record.id = newPathID

      // Check if there is any children for parent.
      if (children.length > 0 ) {

        for(const child of children) {

          const pathIDArr = child.id.split("/")
          const lastPathID = pathIDArr[pathIDArr.length - 1]
          child.id = newPathID + "/" + lastPathID

        }

      }

      graphicsManager.renderFolders()

    } else {

      graphicsManager.toggleAlert("Name already used, try another name.", "warning")

    }

  }
  isParentFolder(id) {
    if(id.includes("/"))
      return false
    else
      return true
  }


  // clipboardArticle() {

  //   let element = document.getElementById(graphicsManager.lastRightClickedSimilarContentID)
  //   dictionaryManager.getWikipediaSummary(element.innerHTML).then(article => {

  //     let key = Object.keys(article.query.pages)[0]
  //     let text = article.query.pages[key].extract
  //     graphicsManager.updateClipboard(text)

  //   })

  // }
  importArticle() {

    let element = document.getElementById(graphicsManager.lastRightClickedSimilarContentID)
    console.log(element)
    
    dictionaryManager.getWikipediaSummary(element.innerHTML).then(article => {
      let key = Object.keys(article.query.pages)[0]
      let extract = article.query.pages[key].extract

      this.createText(element.innerHTML+"-"+createID(2), [{ insert: extract }])

    })

  }



  getAllChildrenByParentId(id){
    // Return all children of parent id.
    if (id.charAt(0) == "/") 
      id = id.substring(1)

    let childrenList = this.database.items.filter(item => item.id.startsWith(id))

    // Remove parent element from list.
    childrenList.splice(childrenList.findIndex(element => element.id == id), 1);

    return childrenList;
  }

  getAllParentsByChildId(id) {

    // TODO: fix function, does not work.
    var path = id.split("/");
    var lastIndex = path.lastIndexOf("/");
    var requiredPath = path.slice(0,lastIndex+1);


  }

  getAllParentPathByChildID(id) {
    
    // TODO: fix function, does not work.
    var path = id.split("/");
    var lastIndex = path.lastIndexOf("/");
    var requiredPath = path.slice(0,lastIndex+1);


  }


  
  getTotalReviewsCount() {
    let total = 0
    this.database.items.forEach(function(record) {
        total += record.repetition
    })
    return total
  }
  getDueCount() {

    let total = 0

    if (databaseManager.database.profile.showClozesInLearningMode)
      total += databaseManager.getDueClozeCount().length
    if (databaseManager.database.profile.showOcclusionsInLearningMode)
      total += databaseManager.getDueOcclusionCount().length
    if (databaseManager.database.profile.showExtractsInLearningMode)
      total += databaseManager.getDueExtractCount().length

    return total
  }
  getDueCountAll() {
    const items = this.database.items.filter(r => r.dueDate < new Date().toJSON() && r.contentType != "Folder")
    return items.length
  }


  getPriorityQueue() {

    let res = databaseManager.database.items.filter(
      (r => r.contentType == "Cloze" ||
      r.contentType == "Extract" ||
      r.contentType == "Occlusion").sort((a, b) => a.dueDate - b.dueDate)
    )

    console.log(res)
    return res

  }




  getExtractCount() {
    return this.database.items.filter(r => r.contentType == "Extract").length
  }
  getFolderCount() {
    return this.database.items.filter(r => r.contentType == "Folder").length
  }
  getClozeCount() {
    return this.database.items.filter(r => r.contentType == "Cloze").length
  }
  getOcclusionCount() {
    return this.database.items.filter(r => r.contentType == "Occlusion").length
  }
  getDueClozeCount() {
    return this.database.items.filter(r => r.contentType == "Cloze" && r.dueDate < new Date().toJSON());
  }
  getDueOcclusionCount() {
    return this.database.items.filter(r => r.contentType == "Occlusion" && r.dueDate < new Date().toJSON());
  }
  getDueExtractCount() {
    return this.database.items.filter(r => r.contentType == "Extract" && r.dueDate < new Date().toJSON());
  }
  

  getDueClozeRecords() {
    return this.database.items.filter(r => r.contentType == "Cloze" && r.dueDate < new Date().toJSON());
  }
  getDueClozeRecord() {
    const r = this.getDueClozeRecords();
    return r[Math.floor(Math.random() * r.length)];
  }
  getDueOcclusionRecords() {
    return this.database.items.filter(r => r.contentType == "Occlusion" && r.dueDate < new Date().toJSON())
  }
  getDueOcclusionRecord() {
    const r = this.getDueOcclusionRecords()
    return r[Math.floor(Math.random() * r.length)];
  }
  getDueExtractRecords() {
    return this.database.items.filter(r => r.contentType == "Extract" && r.dueDate < new Date().toJSON());
  }
  getDueExtractRecord() {
    const r = this.getDueExtractRecords();
    return r[Math.floor(Math.random() * r.length)];
  }

  

  getOcclusionRecords() {
    return this.database.items.filter(r => r.contentType == "Occlusion");
  }
  getClozeRecords(){
    return this.database.items.filter(r => r.contentType == "Cloze");
  }
  getExtractRecords(){
    return this.database.items.filter(r => r.contentType == "Extract");
  }


  getClozeRecord(){
    const r = this.getClozeRecords();
    return r[Math.floor(Math.random() * r.length)];
  }
  getExtractRecord(){
    let r = this.getExtractRecords();
    return r[Math.floor(Math.random() * r.length)];
  }
  getOcclusionRecord() {
    return getOcclusionRecords()[Math.floor(Math.random() * getOcclusionRecords.length)];
  }

}



// Manager to handle the graphics.
class GraphicsManager {
  constructor(){

    this.isLightModeEnabled = true;
    this.isNotZenModeEnabled = true;
    this.activeInformationID = -1; // ID of current cloze / text extract or imageOcclusion.
    this.lastRightClickedItemID = -1;
    this.lastRightClickedSimilarContentID = -1 // ID of last right clicked item in right sidebar.

    this.lastMenuItemClicked = 0 // Last id of clicked menu item in the sidebar.
    this.lastActiveImageOcclusionURL = ""; // URL of last displayed image occlusion.
    this.writtenCharCount = 0; // Autosave database when len > 25

    //PERMISSIONS
    this.askPermission()

    this.toolbarOptions = [
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'image',
        'blockquote',
        // { 'list': 'ordered'},
        // { 'list': 'bullet' },
        // { 'indent': '-1'},
        // { 'indent': '+1' },
        { 'header': [1, 2, 3, 4, 5, 6, false] },
        { 'color': [] },
        { 'background': [] },
        // { 'font': [] },
        // { 'align': [] },
        'clean'
      ],
    ];

    this.statisticsOptions1 = { 
      series: [{
          name: "Repetitions",
          data: [0, 20]
      }],
      chart: {
          height: 300,
          type: 'line',
          zoom: {
            enabled: false
          }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Repetitions per day',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['2021-01-02', '2021-01-02'],
      }
    };

    this.statisticsOptions2 = { 
      series: [{
          name: "New items",
          data: [0, 20]
      }],
      chart: {
          height: 300,
          type: 'line',
          zoom: {
            enabled: false
          }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'New items per day',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['2021-01-02', '2021-01-02'],
      }
    };

    this.chart1 = ""
    this.chart2 = ""


    //Quill.register("modules/imageUploader", ImageUploader)
    //Quill.register("imageDropAndPaste", QuillImageDropAndPaste)
    //Quill.register('modules/imageResize', ImageResize)
    this.activeOcclusionsList = []
    this.quill = new Quill('#content-input', {
        theme: 'bubble',
         modules: {
           toolbar: this.toolbarOptions
         }
    })
    //this.quill.keyboard.addBinding({ key: 'V', ctrlKey: true, shiftKey: true, altKey: true}, this.onQuillPaste);
    //this.quill.keyboard.addBinding({ key: 'S', metaKey: true}, this.onQuillPaste);
    this.quill.on("selection-change", this.onQuillSelectionChange)
    this.quill.on('text-change', this.onQuillTextChange)

    // Cursor position.
    this.locA
    this.locB

    this.tutorialStep = 1

  }



  init() {
    // this.renderInputBox(this.database.items[0])
    // this.renderFolders()
  }

  onTick() {
    this.sidebarUpdate()
  }

  duplicateItem() {
    databaseManager.duplicateItem()
  }

  async triggerTutorial() {

    this.tutorialStep = 1

    document.getElementById("overlay").classList.add("visible")
    document.getElementById("overlay").classList.remove("hidden")
  
    document.getElementById("sidebar-left").classList.add("zIndexHighlight")
    document.getElementById("learning-button").classList.remove("zIndexHighlight")
    document.getElementById("modalbox-content-tutorial-step1").classList.remove("hidden")
    document.getElementById("modalbox-content-tutorial-step2").classList.add("hidden")
  

    const e = document.getElementById("modalbox-tutorial")
    if (e.classList.contains("hidden"))
      e.classList.remove("hidden")
    else
      e.classList.add("hidden")

    return new Promise((resolve, reject) => {

      document.getElementById("modalbox-tutorial-complete-button").addEventListener("click", function(e) {

        document.getElementById("overlay").classList.remove("visible")
        document.getElementById("overlay").classList.add("hidden")
        document.getElementById("modalbox-tutorial").classList.add("hidden")

        databaseManager.database.profile.tutorialCompleted = true
        graphicsManager.toggleAlert("Well done, the tutorial will not show next login.", "success")
        resolve(true)
      
      })

    })
  }

  stepTutorial(stepForward = true) {


    if (stepForward)
      this.tutorialStep += 1
    else 
      this.tutorialStep -= 1

    if (this.tutorialStep < 1)
      this.tutorialStep = 1
    else if(this.tutorialStep > 15)
      this.tutorialStep = 15
    

    if (this.tutorialStep == 1) {

      // Sidebar left
      document.getElementById("sidebar-left").classList.add("zIndexHighlight")
      document.getElementById("learning-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step1").classList.remove("hidden")
      document.getElementById("modalbox-content-tutorial-step2").classList.add("hidden")

    } else if (this.tutorialStep == 2) {

      // Engage button.
      document.getElementById("sidebar-left").classList.remove("zIndexHighlight")
      document.getElementById("learning-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step1").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step2").classList.remove("hidden")

      document.getElementById("sidebar-saved").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step3").classList.add("hidden")

    } else if (this.tutorialStep == 3) {

      // Last saved.
      document.getElementById("learning-button").classList.remove("zIndexHighlight")
      document.getElementById("sidebar-saved").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step2").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step3").classList.remove("hidden")

      document.getElementById("sidebar-due").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step4").classList.add("hidden")


    } else if (this.tutorialStep == 4) {

      document.getElementById("sidebar-saved").classList.remove("zIndexHighlight")
      document.getElementById("sidebar-due").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step3").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step4").classList.remove("hidden")

      document.getElementById("content-input").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step5").classList.add("hidden")

    } else if (this.tutorialStep == 5) {

      document.getElementById("sidebar-due").classList.remove("zIndexHighlight")
      document.getElementById("content-input").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step4").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step5").classList.remove("hidden")

      document.getElementById("header-settings-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step6").classList.add("hidden")

    } else if (this.tutorialStep == 6) {

      document.getElementById("content-input").classList.remove("zIndexHighlight")
      document.getElementById("header-settings-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step5").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step6").classList.remove("hidden")

      document.getElementById("header-darkmode-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step7").classList.add("hidden")

    } else if (this.tutorialStep == 7) {

      document.getElementById("header-settings-button").classList.remove("zIndexHighlight")
      document.getElementById("header-darkmode-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step6").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step7").classList.remove("hidden")

      document.getElementById("header-database-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step8").classList.add("hidden")

    } else if (this.tutorialStep == 8) {

      document.getElementById("header-darkmode-button").classList.remove("zIndexHighlight")
      document.getElementById("header-database-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step7").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step8").classList.remove("hidden")

      document.getElementById("header-explorer-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step9").classList.add("hidden")

    } else if (this.tutorialStep == 9) {

      document.getElementById("header-database-button").classList.remove("zIndexHighlight")
      document.getElementById("header-explorer-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step8").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step9").classList.remove("hidden")

      document.getElementById("header-flagged-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step10").classList.add("hidden")

    } else if (this.tutorialStep == 10) {

      document.getElementById("header-explorer-button").classList.remove("zIndexHighlight")
      document.getElementById("header-flagged-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step9").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step10").classList.remove("hidden")

      document.getElementById("header-statistics-button").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step11").classList.add("hidden")

    } else if (this.tutorialStep == 11) {

      document.getElementById("header-flagged-button").classList.remove("zIndexHighlight")
      document.getElementById("header-statistics-button").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step10").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step11").classList.remove("hidden")

      document.getElementById("sidebar-right").classList.remove("zIndexHighlight")
      document.getElementById("sidebar-right").classList.remove("visible")
      document.getElementById("modalbox-content-tutorial-step12").classList.add("hidden")

    } else if (this.tutorialStep == 12) {

      document.getElementById("header-statistics-button").classList.remove("zIndexHighlight")
      document.getElementById("sidebar-right").classList.add("visible")
      document.getElementById("sidebar-right").classList.add("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step11").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step12").classList.remove("hidden")


      document.getElementById("modalbox-content-tutorial-step13").classList.add("hidden")

    } else if (this.tutorialStep == 13) {

      document.getElementById("sidebar-right").classList.remove("visible")
      document.getElementById("sidebar-right").classList.remove("zIndexHighlight")
      document.getElementById("modalbox-content-tutorial-step12").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step13").classList.remove("hidden")

      document.getElementById("modalbox-content-tutorial-step14").classList.add("hidden")

      //Hide the complete button and show the next button.
      document.getElementById("modalbox-tutorial-complete-button").classList.add("hidden")
      document.getElementById("modalbox-tutorial-next").classList.remove("hidden")

    } else if (this.tutorialStep == 14) {

      document.getElementById("modalbox-content-tutorial-step13").classList.add("hidden")
      document.getElementById("modalbox-content-tutorial-step14").classList.remove("hidden")

      //Hide the next button and show complete button.
      document.getElementById("modalbox-tutorial-complete-button").classList.remove("hidden")
      document.getElementById("modalbox-tutorial-next").classList.add("hidden")

    }

  }
  

  toggleStatisticsModal() {

    const categories = databaseManager.database.profile.statistics
    let date = []
    let reviewsCount = []
    let newItemsCount = []
    for (const [key, value] of Object.entries(categories)) {

      date.push(key)
      reviewsCount.push(value.reviewsCount)
      newItemsCount.push(value.newItemsCount)

    }

    console.log(reviewsCount)

    this.statisticsOptions1.xaxis.categories = date
    this.statisticsOptions1.series[0].data = reviewsCount

    this.statisticsOptions2.xaxis.categories = date
    this.statisticsOptions2.series[0].data = newItemsCount

    this.chart1 = new ApexCharts(document.querySelector("#chart1"), this.statisticsOptions1)
    this.chart2 = new ApexCharts(document.querySelector("#chart2"), this.statisticsOptions2)
    this.chart1.render()
    this.chart2.render()

    // 2. Show the modalbox.
    const e = document.getElementById("modalbox-statistics")
    if (e.classList.contains("hidden")) {

      e.classList.add("visible")
      e.classList.remove("hidden")

    } else {

      e.classList.remove("visible")
      e.classList.add("hidden")

    }

  }


  notifyMe(message) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have alredy been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(message);
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied' || Notification.permission === "default") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(message);
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }


  askNotificationPermission() {

    if (!('Notification' in window)) {

      console.log("This browser does not support notifications.")

    } else {

      if(Notification.permission == "default") {

        Notification.requestPermission().then((permission) => {
          handlePermission(permission)
        })
      }

    }

  }


  askPermission() {

    //this.askNotificationPermission()

  
  }





  renderPriority() {

    document.getElementById("priority-list").innerHTML = "<tr><th>Item</th><th>Repetitions</th><th>E-factor</th><th>Priority</th></tr>"
    
    const items = databaseManager.getPriorityQueue()


    for (const record of items) {

      let p = document.createElement("tr")
      let name = document.createElement("td")
      let repetitions = document.createElement("td")
      let efactor = document.createElement("td")
      let priority = document.createElement("td")

      p.setAttribute("onclick", "graphicsManager.onClickExplorerItem(this)")
      p.setAttribute("data-id", record.id)
      name.innerHTML = record.id
      repetitions.innerHTML = record.repetition
      efactor.innerHTML = record.efactor
      priority.innerHTML = record.priority

      p.appendChild(name)
      p.appendChild(repetitions)
      p.appendChild(efactor)
      p.appendChild(priority)

      document.getElementById("priority-list").appendChild(p)

    }

  }

  renderFlagged() {

    document.getElementById("flagged-list").innerHTML = "<tr><th>Name</th><th>Repetitions</th><th>E-factor</th></tr>"
    
    const items = databaseManager.database.items.filter(r => ["Cloze", "Occlusion", "Extract"].includes(r.contentType) && r.isFlagged)  
    for (const record of items) {

      let p = document.createElement("tr")
      let name = document.createElement("td")
      let repetitions = document.createElement("td")
      let efactor = document.createElement("td")

      p.setAttribute("onclick", "graphicsManager.onClickExplorerItem(this)")
      p.setAttribute("data-id", record.id)

      name.innerHTML = record.id
      repetitions.innerHTML = record.repetition
      efactor.innerHTML = record.efactor

      p.appendChild(name)
      p.appendChild(repetitions)
      p.appendChild(efactor)

      document.getElementById("flagged-list").appendChild(p)

    }

  }



  renderExplorer() {

    document.getElementById("explorer-list").innerHTML = "<tr><th>Name</th><th>Repetitions</th><th>E-factor</th></tr>"
    
    const items = databaseManager.database.items.filter(
      r => ["Cloze", "Occlusion", "Extract"].includes(r.contentType) &&
      r.repetition > -1 &&
      r.efactor < 3
    )
    
    for (const record of items) {

      let p = document.createElement("tr")
      let name = document.createElement("td")
      let repetitions = document.createElement("td")
      let efactor = document.createElement("td")

      p.setAttribute("onclick", "graphicsManager.onClickExplorerItem(this)")
      p.setAttribute("data-id", record.id)
      name.innerHTML = record.id
      repetitions.innerHTML = record.repetition
      efactor.innerHTML = record.efactor

      p.appendChild(name)
      p.appendChild(repetitions)
      p.appendChild(efactor)

      document.getElementById("explorer-list").appendChild(p)

    }

  }

  onClickExplorerItem(item) {

      document.querySelectorAll(".active").forEach((node) => {
        node.classList.remove("active")
      })

      const dataID = item.getAttribute("data-id")
      const r = databaseManager.getRecordByID(dataID)

      if (r.contentType == "Occlusion") {

        this.quill.setContents()
        this.quill.enable(false)
        this.lastMenuItemClicked = r.id
        this.toggleOcclusionLearningModal(r.id)
        item.classList.add("active")

      } else if (r.contentType == "Extract" || r.contentType == "Cloze") {

        this.quill.enable(true)
        this.renderInputBox(r)
        this.lastMenuItemClicked = r.id
        item.classList.add("active")

      } else if (r.contentType == "Folder") {

        this.quill.setContents()
        this.quill.enable(false)
        this.lastMenuItemClicked = r.id
        item.classList.add("active")

      }

      
      let e = document.querySelector("[data-id='"+dataID+"']")
      e.classList.add("active")

      graphicsManager.expandAllParentsToID(r.id)
      

  }

  async renderDatabases() {

    document.getElementById("database-list").innerHTML = "<tr><th>Shared databases</th></tr>"
    const publicIds =  await databaseManager.getPublicDatabases()
    for (const id of publicIds) {

      console.log(id)

      let p = document.createElement("tr")
      let name = document.createElement("td")
      let items = document.createElement("td")
      let author = document.createElement("td")

      p.setAttribute("data-id", id)
      p.setAttribute("onclick", "graphicsManager.onClickDatabaseItem(this)")
      name.innerHTML = id
      items.innerHTML = "-"

      p.appendChild(name)
      //p.appendChild(itemCount)

      document.getElementById("database-list").appendChild(p)
    }

  }

  async renderLeaderboard() {

    document.getElementById("leaderboard-list").innerHTML = "<tr><th>Leaderboard</th></tr>"
    const publicProfiles =  await databaseManager.getPublicProfiles()

    for (const id of publicProfiles) {
      
      // let p = document.createElement("tr")
      // let name = document.createElement("td")
      // let items = document.createElement("td")
      // let author = document.createElement("td")

      // p.setAttribute("data-id", id)
      // p.setAttribute("onclick", "graphicsManager.onClickDatabaseItem(this)")
      // name.innerHTML = id
      // items.innerHTML = "-"

      // p.appendChild(name)
      // // p.appendChild(items)
      // // p.appendChild(author)

      // document.getElementById("leaderboard-list").appendChild(p)
    }

  }

  async onClickDatabaseItem(e) {

    let username = e.getAttribute("data-id")
    let password = prompt("All your data in current database will be overwritten with shared database. Write 'accept' to continue.")
    if (password == "accept") {
      
      let response = await databaseManager.importDatabaseByUsername(username)

      // Database login success, set id of database.
      const savedId = databaseManager.database.profile.id
      databaseManager.database = response
      databaseManager.database.profile.id = savedId
      databaseManager.id = savedId

      document.getElementById("modalbox-databases").classList.add("hidden")
      document.getElementById("modalbox-databases").classList.remove("visible")
      
      this.renderFolders()
      this.toggleAlert("Database loaded.", "success")

    }

  }

  toggleOverlayProfile(){

    document.getElementById("modalbox-profile").classList.add("visible")
    document.getElementById("modalbox-profile").classList.remove("hidden")

    document.getElementById("modalbox-shortcuts").classList.remove("visible")
    document.getElementById("modalbox-shortcuts").classList.add("hidden")
    document.getElementById("modalbox-learning").classList.remove("visible")
    document.getElementById("modalbox-learning").classList.add("hidden")
    document.getElementById("modalbox-interface").classList.remove("visible")
    document.getElementById("modalbox-interface").classList.add("hidden")
    document.getElementById("modalbox-database").classList.remove("visible")
    document.getElementById("modalbox-database").classList.add("hidden")
  
  }
  toggleOverlayShortcuts(){

      document.getElementById("modalbox-shortcuts").classList.add("visible")
      document.getElementById("modalbox-shortcuts").classList.remove("hidden")

      document.getElementById("modalbox-profile").classList.remove("visible")
      document.getElementById("modalbox-profile").classList.add("hidden")
      document.getElementById("modalbox-learning").classList.remove("visible")
      document.getElementById("modalbox-learning").classList.add("hidden")
      document.getElementById("modalbox-interface").classList.remove("visible")
      document.getElementById("modalbox-interface").classList.add("hidden")
      document.getElementById("modalbox-database").classList.remove("visible")
      document.getElementById("modalbox-database").classList.add("hidden")

  }
  toggleOverlayLearning(){

    document.getElementById("modalbox-learning").classList.add("visible")
    document.getElementById("modalbox-learning").classList.remove("hidden")

    document.getElementById("modalbox-shortcuts").classList.remove("visible")
    document.getElementById("modalbox-shortcuts").classList.add("hidden")
    document.getElementById("modalbox-profile").classList.remove("visible")
    document.getElementById("modalbox-profile").classList.add("hidden")
    document.getElementById("modalbox-interface").classList.remove("visible")
    document.getElementById("modalbox-interface").classList.add("hidden")
    document.getElementById("modalbox-database").classList.remove("visible")
    document.getElementById("modalbox-database").classList.add("hidden")

  }
  toggleOverlayInterface(){

      document.getElementById("modalbox-interface").classList.add("visible")
      document.getElementById("modalbox-interface").classList.remove("hidden")

      document.getElementById("modalbox-learning").classList.remove("visible")
      document.getElementById("modalbox-learning").classList.add("hidden")
      document.getElementById("modalbox-shortcuts").classList.remove("visible")
      document.getElementById("modalbox-shortcuts").classList.add("hidden")
      document.getElementById("modalbox-profile").classList.remove("visible")
      document.getElementById("modalbox-profile").classList.add("hidden")
      document.getElementById("modalbox-database").classList.remove("visible")
      document.getElementById("modalbox-database").classList.add("hidden")
  
  }
  toggleOverlayDatabase(){

        document.getElementById("modalbox-database").classList.add("visible")
        document.getElementById("modalbox-database").classList.remove("hidden")

        document.getElementById("modalbox-interface").classList.remove("visible")
        document.getElementById("modalbox-interface").classList.add("hidden")
        document.getElementById("modalbox-learning").classList.remove("visible")
        document.getElementById("modalbox-learning").classList.add("hidden")
        document.getElementById("modalbox-shortcuts").classList.remove("visible")
        document.getElementById("modalbox-shortcuts").classList.add("hidden")
        document.getElementById("modalbox-profile").classList.remove("visible")
        document.getElementById("modalbox-profile").classList.add("hidden")
    
    }

  toggleOverlayInformation(){

    document.getElementById("modalbox-information").classList.remove("visible")
    document.getElementById("modalbox-information").classList.remove("hidden")

    document.getElementById("modalbox-database").classList.remove("visible")
    document.getElementById("modalbox-database").classList.add("hidden")
    document.getElementById("modalbox-interface").classList.remove("visible")
    document.getElementById("modalbox-interface").classList.add("hidden")
    document.getElementById("modalbox-learning").classList.remove("visible")
    document.getElementById("modalbox-learning").classList.add("hidden")
    document.getElementById("modalbox-shortcuts").classList.remove("visible")
    document.getElementById("modalbox-shortcuts").classList.add("hidden")
    document.getElementById("modalbox-profile").classList.remove("visible")
    document.getElementById("modalbox-profile").classList.add("hidden")
  }


  onQuillSelectionChange(range) { 

    if (range !== null && mobileCheck() == false) {

      if(databaseManager.database.profile.showRightSidebar) {

      const range = graphicsManager.quill.getSelection()
      const selectedText = graphicsManager.quill.getText(range.index, range.length)
      const similarContentSidebar = document.getElementById("sidebar-right")
      const contentInput = document.getElementById("content-input")
  
      if (selectedText.length == 0) {

        if(contentInput.classList.contains("collapsed")) 
          contentInput.classList.remove("collapsed")

        if(similarContentSidebar.classList.contains("visible"))  
          similarContentSidebar.classList.remove("visible")

      }

      
    
    if (selectedText.length > 0 && selectedText.length < 32) {


      similarContentSidebar.innerHTML = ""



      // getMeshTermByWord(selectedText).then(async items => {

      //   let meshTitle = document.createElement("h5")
      //   meshTitle.innerHTML = "Svensk MeSH"
      //   similarContentSidebar.appendChild(meshTitle)

      //   console.log("Mesh: " + items.length)
        
      //   if (items.length > 0) {

      //     if(!contentInput.classList.contains("collapsed")) 
      //       contentInput.classList.add("collapsed")

      //     if(!similarContentSidebar.classList.contains("visible"))  
      //       similarContentSidebar.classList.add("visible")
          
      //   }

      //   for(const [key, value] of Object.entries(items)) {

      //     const id = `sidebar-right-item-mesh-${createID(4)}`
      //     similarContentSidebar.innerHTML += `<a href="${value.link}" data='${value.description}' id="${id}" class="similar-content-item" target="_blank" and rel="noopener noreferrer" onmouseenter='graphicsManager.toggleItemSummary(event)' onmouseleave='graphicsManager.toggleItemSummary(event)' onclick='graphicsManager.toggleItemSummary(event)'>${value.title}</a><br>`
        
      //   }

      // })



      // psykologiguidenLookupWord(selectedText).then(async words => {

      //   let psykologiguidenTitle = document.createElement("h5")
      //   psykologiguidenTitle.innerHTML = "Psykologiguiden"
      //   similarContentSidebar.appendChild(psykologiguidenTitle)
        
      //   console.log("Psykologiguiden: " + words.length)
      //   if (words.length > 0) {

      //     if(!contentInput.classList.contains("collapsed")) 
      //       contentInput.classList.add("collapsed")

      //     if(!similarContentSidebar.classList.contains("visible"))  
      //       similarContentSidebar.classList.add("visible")
          
      //   }


      //   let psykologiguidenItems = []
      //   for(const [key, value] of Object.entries(words)) {

      //     const id = `sidebar-right-item-psykologiguiden-${createID(4)}`
      //     value.id = id

      //     psykologiguidenItems.push(value)
      //     similarContentSidebar.innerHTML += `<a data='' id="${id}" class="similar-content-item" target="_blank" and rel="noopener noreferrer" onmouseenter='graphicsManager.toggleItemSummary(event)' onmouseleave='graphicsManager.toggleItemSummary(event)' onclick=''>${value.lexWord}</a><br>`
        
      //   }

      //   // Add Psykologiguiden content to sidebar.
      //   for(const item of psykologiguidenItems) {

      //     const element = document.getElementById(item.id)
      //     const Response = await psykologiguidenGetExplanationByID(item.lexId)
      //     // const summary = response.
      //     // console.log(summary)
      //     // element.setAttribute("data", summary)

      //   }

      // })


      dictionaryManager.getWikipedia(selectedText).then(async articles => {

        let wikipediaTitle = document.createElement("h5")
        wikipediaTitle.innerHTML = "Wikipedia"
        similarContentSidebar.appendChild(wikipediaTitle)

        console.log("Wikipedia: " + articles[1].length)
        if (articles[1].length > 0) {

          if(!contentInput.classList.contains("collapsed")) 
            contentInput.classList.add("collapsed")

          if(!similarContentSidebar.classList.contains("visible"))  
            similarContentSidebar.classList.add("visible")
          
        }

        let articleList = {
          "title": articles[1],
          "link": articles[3]
        }

        let items = []
        for(let i = 0; i < articleList.title.length; i++) {

          const title = articleList.title[i]
          const link = articleList.link[i]
          const id = `sidebar-right-item-${title}-${createID(2)}`

          items.push({
            "id": id,
            "title": title,
            "link": link
          })

          similarContentSidebar.innerHTML += `<a data='' id="${id}" class="similar-content-item" target="_blank" and rel="noopener noreferrer" onmouseenter='graphicsManager.toggleItemSummary(event)' onmouseleave='graphicsManager.toggleItemSummary(event)' onclick='graphicsManager.onWikipediaItemClicked(event)'>${title}</a><br>` //href='${link}'>${title}
        }

        // Add Wikipedia content to sidebar.
        for(const item of items) {

          const element = document.getElementById(item.id)
          const article = await dictionaryManager.getWikipediaSummary(item.title)
          const key = Object.keys(article.query.pages)[0]
          const summary = article.query.pages[key].extract

          element.setAttribute("data", summary)

        }





      })

      // dictionaryManager.getRelatedPicturesByQuery(selectedText, 5).then(pictures => {

      //   if (pictures !== undefined) {

      //     for(let i = 0; i < pictures.value.length; i++) {

      //       let newImage = document.createElement("img")
      //       newImage.classList.add("sidebar-right-image")
      //       newImage.src = pictures.value[i].thumbnailUrl
            
      //       newImage.setAttribute("onclick", "graphicsManager.onImageSidebarClicked(event, this)")
      //       newImage.setAttribute("onmouseenter", "graphicsManager.toggleModalFullImage(event)") 
      //       newImage.setAttribute("onmouseleave", "graphicsManager.toggleModalFullImage(event)")
      //       //newImage.setAttribute("onclick", "graphicsManager.updateOcclusionCreateCanvas(event)")
      //       similarContentSidebar.appendChild(newImage)
      //     }

      //   }

      // })

  

    }
    
  } else {

    const contentInput = document.getElementById("content-input")

    if(contentInput.classList.contains("collapsed")) 
      contentInput.classList.remove("collapsed")

    if(similarContentSidebar.classList.contains("visible"))  
      similarContentSidebar.classList.remove("visible")

  }

  }

}


  onQuillTextChange(delta, oldDelta, source) {

    // if(graphicsManager.writtenCharCount > 10) {

    //   graphicsManager.writtenCharCount = 0
    //   const r = databaseManager.getRecordByID(graphicsManager.activeInformationID)
    //   r.content = oldDelta


    // }

    // graphicsManager.writtenCharCount += 1
  
  }

  // toggleDefault(){}
  // toggleSuccess(message = "test", time = 5)
  // toggleWarning(){}
  // toggleDanger(){}

  toggleAlert(message, type = "default") {

    let parent = document.getElementById("modalbox-alert")
    let child = document.getElementById("modalbox-alert-message")
    parent.classList = ""
    parent.classList.add("modalbox-alert-active")
    parent.classList.add(type)

    child.innerHTML = message

    let parentClone = parent.cloneNode(true);
    let chhildClone = child.cloneNode(true);

    parent.parentNode.replaceChild(parentClone, parent);
    child.parentNode.replaceChild(chhildClone, child)
  }


  getMousePos(e) {

    // Get the bounds of the clicked element.
    var rect = e.target.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  onCanvasMouseDown(e) {
    e.preventDefault();
    this.locA = this.getMousePos(e);
  }

  onCanvasMouseUp(e) {

    e.preventDefault();
    this.locB = this.getMousePos(e);

    const factor = 2000 / 600

    e.target.getContext('2d').fillStyle = '#CCCC00';
    e.target.getContext('2d').fillRect(this.locA.x * factor, this.locA.y * factor, ((this.locB.x * factor) - (this.locA.x * factor)), ((this.locB.y * factor) - (this.locA.y * factor)));

    this.activeOcclusionsList.push(
      new Occlusion(this.locA.x * factor, this.locA.y * factor, ((this.locB.x * factor) - (this.locA.x * factor)), ((this.locB.y * factor) - (this.locA.y * factor)) )
    )

  }


  sidebarUpdate(){

    // Update graphics in sidebar
    document.getElementById("sidebar-due-items").innerHTML = databaseManager.getDueCount() + "(" + databaseManager.getDueCountAll() + ")"

  }

  

  // When drag starts.
  onFolderDrag(event) {

    event.dataTransfer.setData("data-id", event.target.getAttribute("data-id"));
  }

  findDiff(str1, str2){ 
    let diff= "";
    str2.split('').forEach(function(val, i){
      if (val != str1.charAt(i))
        diff += val ;         
    });
    return diff;
  }



  // When item has been dropped
  onItemDrop(event) {

    // When drop starts.
    event.preventDefault();

    let droppedOnDataID = event.target.getAttribute("data-id");
    let dragedDataID = event.dataTransfer.getData("data-id");

    let droppedOnRecord = databaseManager.getRecordByID(droppedOnDataID)
    let dragedRecord = databaseManager.getRecordByID(dragedDataID)

    /*

    Folder1
    Folder2
    Folder2/Folder3
    Folder2/Folder4
    Folder2/Folder4/Folder5

    Folder2/Folder4 -> 
    Folder2/Folder3 ->

    Folder2/Folder3/Folder2

    Folder2/Folder3/Folder2/Folder4

    */

    // Disable drop functionality on other than folders and extracts.
    if(["Folder", "Extract"].includes(droppedOnRecord.contentType)) {

      // Check that the folder / item is not dropped on itself.
      if (droppedOnDataID != dragedDataID) {

        databaseManager.moveItemID(dragedDataID, droppedOnDataID)
        graphicsManager.renderFolders()
        graphicsManager.expandAllParentsToID(dragedDataID)
        graphicsManager.expandAllParentsToID(droppedOnDataID)
        graphicsManager.expandItemByID(droppedOnDataID)
        
      } else {
        graphicsManager.toggleAlert("Item can not be dropped on itself.", "warning")
      }

    } else {
      this.toggleAlert("Dropped item can only be placed in folders or extracts.", "warning")
    }


  }

  onFolderDragOver(event){
    event.preventDefault();
  }

  renderClozure(record) {
        // Check if record exists in database to show.
        if (record === undefined) {

          // No records in database, show empty
          this.activeInformationID = -1
          this.quill.setText("No records found in database. Create a new one with help of right clicking in the left sidebar and create folder or start typing in this window and use CTRL + X for extract or CTRL + C for cloze deletion.");
    
        } else {
    
            this.activeInformationID = record.id
    
            if (["Cloze", "Extract"].includes(record.contentType)) { 
    
              this.quill.setContents(record.content);
              if (record.contentType == "Cloze") {
        
                record.clozes.forEach((cloze) => {

                  console.log(graphicsManager.isLightModeEnabled)
                  if (graphicsManager.isLightModeEnabled) {

                    this.quill.formatText(cloze.startindex, cloze.stopindex, {
                      'color': 'rgb(0,0,0)',
                      'background-color': 'rgba(115, 185, 255, 0.7)'
                    })

                  } else {

                    this.quill.formatText(cloze.startindex, cloze.stopindex, {
                      'color': 'rgb(255,255,255)',
                      'background-color': 'rgba(255, 255, 255, 0.7)'
                    })

                  }
    
                })
    
              }
            }
    
        }
  }

  toggleDatabaseShare() {

    const b = document.getElementById("modalbox-settings-database-shared-checkbox")
    if (databaseManager.database.profile.isDatabasePublic) 
      databaseManager.makeDatabasePrivate()
    else
      databaseManager.makeDatabasePublic()

  }

  toggleExtractsInLearning() {

    const b = document.getElementById("modalbox-profile-extracts-button")

    if ( b.classList.contains("enable-button") ) {

      b.classList.remove("enable-button")
      b.classList.add("disable-button")
      b.innerHTML = "Disable extracts in learning mode"

    } else {

      b.classList.remove("disable-button")
      b.classList.add("enable-button")
      b.innerHTML = "Enable extracts in learning mode"

    }

  }
  toggleOcclusionsInLearning() {

    const b = document.getElementById("modalbox-profile-occlusions-button")

    if ( b.classList.contains("enable-button") ) {

      b.classList.remove("enable-button")
      b.classList.add("disable-button")
      b.innerHTML = "Disable occlusions in learning mode"

    } else {

      b.classList.remove("disable-button")
      b.classList.add("enable-button")
      b.innerHTML = "Enable occlusions in learning mode"

    }

  }
  toggleClozesInLearning() {

    const b = document.getElementById("modalbox-profile-clozes-button")

    if ( b.classList.contains("enable-button") ) {

      b.classList.remove("enable-button")
      b.classList.add("disable-button")
      b.innerHTML = "Disable clozes in learning mode"

    } else {

      b.classList.remove("disable-button")
      b.classList.add("enable-button")
      b.innerHTML = "Enable clozes in learning mode"

    }

  }

  renderInputBox(record) {

    // Check if record exists in database to show.
    if (record === undefined) {

      // No records in database, show empty
      this.activeInformationID = -1
      this.quill.setText("No records found in database. Create a new one with help of right clicking in the left sidebar and create folder or start typing in this window and use CTRL + X for extract or CTRL + C for cloze deletion.");

    } else {

        this.activeInformationID = record.id

        if (["Cloze", "Extract"].includes(record.contentType)) { 

          this.quill.setContents(record.content);
          if (record.contentType == "Cloze") {
            
            if(graphicsManager.isLightModeEnabled) {

            record.clozes.forEach((cloze) => {

                this.quill.formatText(cloze.startindex, cloze.stopindex, {
                  'color': 'rgb(0, 0, 0)',
                  'background-color': 'rgba(0, 0, 0)'
                })

            })

          } else {

            record.clozes.forEach((cloze) => {

              this.quill.formatText(cloze.startindex, cloze.stopindex, {
                'color': 'rgb(255, 255, 255)',
                'background-color': 'rgba(255, 255, 255)'
              })
              
          })

          }


          }
        }

    }

  }


  async triggerPolicy(){

    document.getElementById("modalbox-tos").classList.add("visible")
    document.getElementById("modalbox-tos").classList.remove("hidden")
    document.getElementById("overlay").classList.add("visible")
    document.getElementById("overlay").classList.remove("hidden")
    graphicsManager.toggleAlert("In order to continue using Eve you have to accept the Terms of Agreement.")

    return new Promise((resolve, reject) => {

      document.getElementById("modalbox-tos-button").addEventListener("click", async function() {

        document.getElementById("overlay").classList.remove("visible")
        document.getElementById("overlay").classList.add("hidden")
        document.getElementById("modalbox-tos").classList.remove("visible")
        document.getElementById("modalbox-tos").classList.add("hidden")
      
        databaseManager.database.profile.acceptedPolicy = true
        databaseManager.database.loggedIn = true
      
        graphicsManager.renderFolders()
        databaseManager.saveLocalDatabase()
  
        resolve(true)
      
      })

    });


  }

  async triggerChangelog() {

    document.getElementById("modalbox-changelog").classList.add("visible")
    document.getElementById("modalbox-changelog").classList.remove("hidden")

    if(document.getElementById("overlay").classList.contains("hidden"))
      document.getElementById("overlay").classList.remove("hidden")

    graphicsManager.toggleAlert("Welcome back! A few changes has been made since you last visited.")

  }

  toggleSpotlight() {

    let element = document.getElementById("modalbox-spotlight")
    if(!element.classList.contains("visible")) {
      element.classList.add("visible")
      element.classList.remove("hidden")
    } else {
      element.classList.remove("visible")
      element.classList.add("hidden")
    }

  }

  createTextExtract() {

    let currentID = graphicsManager.activeInformationID
    let range = this.quill.getSelection()
    let selectedText = this.quill.getContents(range.index, range.length)

    let record = new Record({
      id: currentID+"/"+createID(6),
      contentType: "Extract",
      content: selectedText
    })

    // Append selected text to database.
    databaseManager.addRecord(record);

    // Format the text visually with yellow overlay.
    this.quill.formatText(range.index, range.length, {
      'background': databaseManager.database.profile.extractHighlightColor
    })

    this.quill.setSelection(null)
    this.expandAllParentsToID(record.id)
    
  }
  createClozeItem() {

    let currentID = graphicsManager.activeInformationID
    let range = this.quill.getSelection();
    let contentDelta = this.quill.getContents();
    let selectedText = this.quill.getText(range.index, range.length);
    let currentRecord = databaseManager.getRecordByID(currentID)

    if (currentRecord.contentType == "Cloze") {
      currentID = currentID.split("/")
      currentID.pop()
      currentID = currentID.join("/")
    }

    // Create new record of selected text.
    let record = new Record({
      id: currentID+"/"+createID(6),
      contentType: "Cloze",
      content: contentDelta,
      clozes: [new Cloze(selectedText, range.index, range.length)]
    })

    // Append selected text to database.
    databaseManager.addRecord(record)

    // Highlight the text visually. 
    this.quill.formatText(range.index, range.length, {
      'background': databaseManager.database.profile.clozeHighlightColor
    })

    this.quill.setSelection(null)
    this.expandAllParentsToID(record.id)

  }

  disableQuillInput() {
    
  }

  HighlightItemInSidebarByID(id) {

    document.querySelectorAll(".active").forEach((node) => {
      node.classList.remove("active")
    })

    const clickedRecord = databaseManager.getRecordByID(id)
    const clickedDOM = document.querySelector('[data-id="'+id+'"]')

    this.lastMenuItemClicked = clickedRecord.id
    clickedDOM.classList.add("active")

    clickedDOM.parentElement.querySelectorAll(":scope > div").forEach((item) => {
      item.classList.toggle("visible")
    })


  }


  onMenuItemClicked(event) {

        document.querySelectorAll(".active").forEach((node) => {
          node.classList.remove("active")
        })

        const r = databaseManager.getRecordByID(graphicsManager.activeInformationID)
        const clickedRecord = databaseManager.getRecordByID(event.target.getAttribute("data-id"))


        // Save current record if any to enable fast switching.
        if (r !== null && r !== undefined) {
          r.content = graphicsManager.quill.getContents()  
        }


        if (clickedRecord.contentType == "Occlusion") {

          //this.quill.setContents()
          this.quill.enable(false)
          this.lastMenuItemClicked = clickedRecord.id // ID = random + filename
          this.toggleOcclusionLearningModal(clickedRecord.id)
          event.target.classList.add("active");

        } else if (clickedRecord.contentType == "Extract" || clickedRecord.contentType == "Cloze") {

          this.quill.enable(true)
          this.lastMenuItemClicked = clickedRecord.id
          event.target.classList.add("active")
          this.renderInputBox(clickedRecord)

        } else if (clickedRecord.contentType == "Folder") {

 
          this.lastMenuItemClicked = clickedRecord.id
          event.target.classList.add("active")

        }
        
        event.target.parentElement.querySelectorAll(":scope > div").forEach((item) => {
            item.classList.toggle("visible")
        })

  }

  createFolderTree(tree, values) {
              
    if (values.length == 0)
      return tree

    const part = values.shift()
    tree[part] = this.createFolderTree(tree[part] || {}, values)

    return tree
  }

  

  renderFolderTree(tree, depth = 0, path = []) {

      return Object.keys(tree).map(key => {

        let itemID = path.join("/")+"/"+key
        if (itemID.charAt(0) == "/")
          itemID = itemID.substring(1)

        let record = databaseManager.getRecordByID(itemID)
        if (record === undefined) {
          
          databaseManager.createFolder(itemID)
          if (IS_DEVELOPMENT)
            console.log("Document created, not found: " + itemID)
        }

            let parent = document.createElement("div")
            let child = document.createElement("p")
            let image = document.createElement("img")

            parent.classList.add("menuSubItem")
            image.classList.add("threeIcon")

            // databaseManager.removeItem(this.lastRightClickedItemID)
            // this.renderFolders()
            // this.expandAllParentsToID(this.lastRightClickedItemID)
            // if (this.lastRightClickedItemID == this.activeInformationID) {
            // graphicsManager.lastRightClickedItemID = null
            // graphicsManager.activeInformationID = null
            // graphicsManager.quill.setContents()
            // graphicsManager.quill.enable(false)

            if(record.contentType == "Occlusion" && databaseManager.database.profile.showImagesInSidebar == false) {
              child.classList.add("hidden")
            }

            if(record.isFlagged) {

              console.log(record.isFlagged)
              if(!child.classList.contains("flagged"))
                child.classList.add("flagged")
            
              }

            if(record.contentType == "Folder")
              image.src = "assets/img/folderclose.svg"
            else if(record.contentType == "Cloze") 
              image.src = "assets/img/cloze.svg"
            else if(record.contentType == "Extract")
              image.src = "assets/img/extract.svg"
            else if(record.contentType == "Occlusion") {
              image.src = "assets/img/occlusion2.svg"
              
            }

            
            child.setAttribute("onclick", "graphicsManager.onMenuItemClicked(event)")
            child.setAttribute("ondragstart", "graphicsManager.onFolderDrag(event)")
            child.setAttribute("ondragover", "graphicsManager.onFolderDragOver(event)")
            child.setAttribute("ondrop", "graphicsManager.onItemDrop(event)")
            child.setAttribute("data-id", itemID)
            child.setAttribute("draggable", true)
            
            child.appendChild(image)
            child.innerHTML += key

            parent.appendChild(child)

            let children = this.renderFolderTree(tree[key], depth+1, [...path, key])
            children.forEach(element => {
                parent.appendChild(element)
            })

            return parent
        

      })
  }

  renderFolders(){

        

        let createdTree = databaseManager.database.items.reduce((tree, file) => this.createFolderTree(tree, file.id.split("/")), {})
        let renderedTree = this.renderFolderTree(createdTree)
        document.getElementById("content-structure").innerHTML = ""

        renderedTree.forEach(element => {
          document.getElementById("content-structure").appendChild(element)
        })

          // // Add filter to all images
          // const images = document.querySelectorAll("img")
          // images.forEach.call(images, function(image) {
            
          //   image.classList.remove("filter-day")
          //   image.classList.remove("filter-night")
          //   image.classList.remove("filter-homebrew")

          //   if(databaseManager.database.profile.theme !== "day")
          //     image.classList.add("filter-"+theme)

          // });

        this.sidebarUpdate()
  }

  collapseFolderByID(id) {

    // Collapse and hide all childrens.


  }


  expandAllParentsToID(id) {

    let path = id.split("/")
    path.pop() // Remove last element


    let AllParentsIDList = []
    let current = ""
    for (let i = 0; i < path.length; i++) {
      current += "/" + path[i]
      AllParentsIDList.push(current.substring(1))
    }

    //document.querySelector('[data-id="'+id+'"]').classList.add("active")

    for (const r of AllParentsIDList) {

      let parent = document.querySelector('[data-id="'+r+'"]').parentElement

      parent.querySelectorAll(':scope > .menuSubItem').forEach((menuSubItem)=>{
        menuSubItem.classList.add("visible")
      })
    }




  }

  expandItemByID(id = "Folder2") {

    document.querySelectorAll(".active").forEach((node) => {
      node.classList.remove("active")
    })

    const clickedRecord = databaseManager.getRecordByID(id)
    const clickedDOM = document.querySelector('[data-id="'+id+'"]')

    this.quill.setContents()
    this.quill.enable(false)
    this.lastMenuItemClicked = clickedRecord.id
    clickedDOM.classList.add("active")

    clickedDOM.parentElement.querySelectorAll(":scope > div").forEach((item) => {
      item.classList.toggle("visible")
    })

  }


  removeItem(){

    if (this.lastRightClickedItemID != null && this.lastRightClickedItemID != -1) {
      databaseManager.removeItem(this.lastRightClickedItemID)
  
      this.renderFolders()
      this.expandAllParentsToID(this.lastRightClickedItemID)

      // Removed item which was selected
      if (this.lastRightClickedItemID == this.activeInformationID) {

      graphicsManager.lastRightClickedItemID = null
      graphicsManager.activeInformationID = null
      graphicsManager.quill.setContents()
      graphicsManager.quill.enable(false)

      }
 

      
    } else {

      this.renderFolders()

    }


    

  }
  renameItem() {

      // If null, create a root directory, else child directory.
      const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)
      if (r != null) {  

        let itemName = r.id
        if (r.id.includes("/")) {
          
          let temp = r.id.split("/")
          itemName = temp[temp.length-1]
        
        }

        console.log(itemName)

        const newName = prompt("New name of item", itemName)
        if(newName != null && newName != "") {

          databaseManager.renameItem(r.id, newName)
          this.renderFolders()
          this.expandAllParentsToID(r.id)

        } else {

          graphicsManager.toggleAlert("Name of item can not be empty.", "warning")

        }

      }
      
    }


    createFolder() {

        const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)
        if (r != null) {

          if(["Folder", "Extract"].includes(r.contentType)) {

            const input = prompt("Name of folder", "Name of folder here...")

            if(input != null && input != "") {

              const foldername = r.id + "/" + input
              console.log("Creating folder ID: " + foldername)

              if(databaseManager.itemExistByID(foldername) == false) {
                
                databaseManager.createFolder(foldername)
                this.renderFolders()
                this.expandAllParentsToID(foldername)

              } else {
                this.toggleAlert("Folder name has already been used in same path. Try another name.", "warning")
              }

            }

          } else {
            this.toggleAlert("Can not create a folder, unknown error.", "warning")
          }

        } else {


            // Create folder in root
            const folderName = prompt("Name of folder", "Name of folder here...")

            if(folderName != null && folderName != "") {
  
              // Check if ID has been used before
              if(databaseManager.database.items.filter(r => r.id == folderName).length == 0) {
                
                databaseManager.createFolder(folderName)
                this.renderFolders()

              } else {
                this.toggleAlert("Folder name has already been used in same path. Try another name.", "warning")
              }

            } else {

              this.toggleAlert("Can not create a folder with empty name.", "warning")

          }




        }

    }

  createText() {

    const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)
    if (r != null) {

      if(["Folder", "Extract"].includes(r.contentType)) {

        const path = r.id + "/" + createID(6)  
        databaseManager.createText(path); 
        this.renderFolders();
        this.expandAllParentsToID(path)

      } else {

        this.toggleAlert("Can not create an text item in this type of object.", "warning")
      
      }

    } else {

        // Clicked in root, outside of any item. Create text as root.
        const path = createID(6)
        databaseManager.createText(path); 
        this.renderFolders();
        this.expandAllParentsToID(path)

    }
    

  }



    // const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)
    
    // if (r != null) {

    //   if(["Folder", "Extract"].includes(r.contentType)) {

    //     const path = r.id + "/" + createID(6)  
    //     databaseManager.createText(path); 
    //     this.renderFolders();
    //     this.expandAllParentsToID(path)

    //   } else {

    //     this.toggleAlert("Can not create an text item in this type of object.")
      
    //   }

    // } else {
    //     // Clicked in root, outside of any item. Create text as root.
    //     const path = createID(6)
    //     databaseManager.createText(path); 
    //     this.renderFolders();
    //     this.expandAllParentsToID(path)
    //   }


  


  spotlightOnKeyDown(e) {

    // Search if enter are pressed.
    if(e.key == "Enter") {

      this.searchDatabaseByKeyword(e.target.value)

    }

  } 


  onSpotlightClick(event) {
    //Activate item when clicked.
  }


  // searchDatabaseByKeyword(q) {

  //   const filter = `username:${databaseManager.id}`

  //   databaseManager.index.search(q, {filters: filter, facets: ['username'], attributesToHighlight: ["content"]}).then(({ hits }) => {

  //     document.getElementById("modalbox-spotlight-result").innerHTML = ""

  //     for (const hit of hits) {

  //       let child = document.createElement("div")
  //       let title = document.createElement("div")
  //       let content = document.createElement("div")

  //       child.classList.add("modalbox-spotlight-result-item")
  //       title.classList.add("modalbox-spotlight-result-item-title")
  //       content.classList.add("modalbox-spotlight-result-item-content")

  //       title.innerHTML = hit.objectID.split("-")[1]
  //       content.innerHTML = hit['_highlightResult'].content.value.substring(0, 100)

  //       child.setAttribute("onclick", "graphicsManager.algoliaResultOnClick(event, this)")
  //       child.setAttribute("data-id", hit.objectID.split("-")[1])
  //       child.appendChild(title)
  //       child.appendChild(content)

  //       document.getElementById("modalbox-spotlight-result").appendChild(child)

  //    }

  //  })

  // }

  algoliaResultOnClick(event, element) {
    


    const clickedRecord = databaseManager.getRecordByID(element.getAttribute("data-id"))
    const e = document.querySelector('[data-id="'+clickedRecord.id+'"]');

    document.querySelectorAll(".active").forEach((node) => {
      node.classList.remove("active")
    })

    if (clickedRecord.contentType == "Occlusion") {

      this.quill.setContents()
      this.quill.enable(false)
      this.lastMenuItemClicked = clickedRecord.id // ID = random + filename
      this.toggleOcclusionLearningModal(clickedRecord.id)

    } else if (clickedRecord.contentType == "Extract" || clickedRecord.contentType == "Cloze") {

      this.quill.enable(true)
      this.renderInputBox(clickedRecord);
      this.lastMenuItemClicked = clickedRecord.id

    } else if (clickedRecord.contentType == "Folder") {

      this.quill.setContents()
      this.quill.enable(false)
      this.lastMenuItemClicked = clickedRecord.id


    }

    e.classList.add("active");
    this.expandAllParentsToID(clickedRecord.id)
    
    e.parentElement.querySelectorAll(":scope > div").forEach((item) => {
      item.classList.toggle("visible")
    })


  }


  async handleDroppedItem(event) {
    
    handleDocumentImport(event)

  }


  async quillOnDrop(event) {

    event.preventDefault();
    this.handleDroppedItem(event)
  
  }

  quillOnKeyDown(event, element) {

    // event.preventDefault()
    // Get all shortcuts for quill editor events.
    let clozeShortcut = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-cloze")
    let extractShortcut = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-extract")
    let summarizeShortcut = databaseManager.database.profile.shortcuts.find(r => r.event == "input-text-summarize")
    //let flagShortcut = databaseManager.database.profile.shortcuts.find(r => r.event == "input-flag-item")

    // Create cloze when pressed.
    if (event.keyCode == clozeShortcut.keyCode &&
        (event.ctrlKey == clozeShortcut.ctrlKey ||
        event.metaKey == clozeShortcut.metaKey) &&
        event.altKey == clozeShortcut.altKey) {

          graphicsManager.createClozeItem()

    } else if (event.keyCode == extractShortcut.keyCode &&
      (event.ctrlKey == extractShortcut.ctrlKey ||
      event.metaKey == extractShortcut.metaKey) &&
      event.altKey == extractShortcut.altKey) {

        graphicsManager.createTextExtract()

    } else if (event.keyCode == summarizeShortcut.keyCode &&
    (event.ctrlKey == summarizeShortcut.ctrlKey ||
    event.metaKey == summarizeShortcut.metaKey) &&
    event.altKey == summarizeShortcut.altKey) {

        let range = graphicsManager.quill.getSelection();
        if (range) {

          if(range.length > 0) {

            const selectedText = graphicsManager.quill.getText(range.index, range.length)
            const summarizedText = dictionaryManager.getTextSummarization(selectedText).then((text) => {

            let currentID = graphicsManager.activeInformationID
            let newID = currentID + "/" + createID(6)
            let record = new Record({
              id: newID,
              contentType: "Extract",
              content: {
                "ops": [{"insert": text}]
              }
            })

            databaseManager.addRecord(record);
            graphicsManager.quill.setSelection(null)
            graphicsManager.expandAllParentsToID(newID)

            })

          }

        }

    }
    

  
  }

  saveLocalDatabase() {

    let d = new Date()
    let currentHours = d.getHours();
    let currentMinutes = d.getMinutes();
    currentHours = ("0" + currentHours).slice(-2);
    currentMinutes = ("0" + currentMinutes).slice(-2);


    document.getElementById("sidebar-last-saved").innerHTML = `${currentHours}:${currentMinutes}`

  }

  async getFileFromURL(image) {

    const response = await fetch(image)
    const blob = await response.blob()
    const file = new File([blob], createID()+".jpg", {type: blob.type})
    return file
  
  }

  async onImageSidebarClicked(e) {

    const file = await this.getFileFromURL(e.target.src)
    const filename = await databaseManager.uploadFile(file)
    this.lastActiveImageOcclusionURL = filename

    let image = new Image()
    image.crossOrigin = "anonymous"
    image.src = BASE_URL + filename
    image.onload = () => this.updateOcclusionCreateCanvas(image)

  }

  toggleOcclusionCreateModal() {

    // Check if visisble, then make invisible.
    const modalElement = document.getElementById("modalbox-occlusion-create")
    if (modalElement.classList.contains("visible")) {

      document.getElementById("modalbox-occlusion-create").classList.add("hidden")
      document.getElementById("modalbox-occlusion-create").classList.remove("visible")
      document.getElementById("overlay").classList.add("hidden")
      document.getElementById("overlay").classList.remove("visible")

    } else {

      document.getElementById("modalbox-occlusion-create").classList.remove("hidden")
      document.getElementById("modalbox-occlusion-create").classList.add("visible")
      document.getElementById("overlay").classList.remove("hidden")
      document.getElementById("overlay").classList.add("visible")

    }

  }

  updateOcclusionCreateCanvas(imageCreate, toggle = true) {

      if(toggle)
        this.toggleOcclusionCreateModal()

      let canvasCreate = document.getElementById("modalbox-occlusion-create-canvas")
      let ctxLearning = canvasCreate.getContext("2d")

      if(toggle)
        ctxLearning.clearRect(0, 0, 2000, 2000);

      var scale = Math.min(canvasCreate.width / imageCreate.width, canvasCreate.height / imageCreate.height);
      var x = (canvasCreate.width / 2) - (imageCreate.width / 2) * scale;
      var y = (canvasCreate.height / 2) - (imageCreate.height / 2) * scale;
      
      if(toggle)
        ctxLearning.drawImage(imageCreate, x, y, imageCreate.width * scale, imageCreate.height * scale);
  
    }

  updateOcclusionLearnCanvas(id, showClozes = true) {

    let record = databaseManager.getRecordByID(id)
    let image = new Image()

    image.src = BASE_URL + record.url
    image.onload = () => {
      
      let canvas = document.getElementById("modalbox-occlusion-learning-canvas")
      let ctx = canvas.getContext("2d")
      let scale = Math.min(canvas.width / image.width, canvas.height / image.height)
      let x = (canvas.width / 2) - (image.width / 2) * scale
      let y = (canvas.height / 2) - (image.height / 2) * scale
    
      ctx.fillStyle = '#CCCC00';
      ctx.clearRect(0, 0, 2000, 2000)
      ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

      if(showClozes) {

        record.occlusions.forEach(function (occlusion) {
          ctx.fillRect(occlusion.x, occlusion.y, occlusion.width, occlusion.height)
        })

      }

    }

  }


  toggleOcclusionLearningModal(id, showClozes = true) {

    this.updateOcclusionLearnCanvas(id, showClozes);

    // Check if visisble, then make invisible.
    const modalElement = document.getElementById("modalbox-occlusion-learning")
    if (modalElement.classList.contains("visible")) {
      document.getElementById("modalbox-occlusion-learning").classList.add("hidden")
      document.getElementById("modalbox-occlusion-learning").classList.remove("visible")
      document.getElementById("overlay").classList.add("hidden")
      document.getElementById("overlay").classList.remove("visible")
    } else {
      document.getElementById("modalbox-occlusion-learning").classList.remove("hidden")
      document.getElementById("modalbox-occlusion-learning").classList.add("visible")
      document.getElementById("overlay").classList.remove("hidden")
      document.getElementById("overlay").classList.add("visible")
    }

  }



  toggleInformationModal() {

    // Already visible, hide modalbox and overlay
    if (document.getElementById("modalbox-information").classList.contains("visible")) {
      document.getElementById("overlay").classList.remove("visible")
      document.getElementById("overlay").classList.add("hidden")
      document.getElementById("modalbox-information").classList.add("hidden")
      document.getElementById("modalbox-information").classList.remove("visible")
    } else {
      document.getElementById("overlay").classList.add("visible")
      document.getElementById("overlay").classList.remove("hidden")
      document.getElementById("modalbox-information").classList.remove("hidden")
      document.getElementById("modalbox-information").classList.add("visible")
    }

  }
  toggleLearningMode() {

    const engageButtonElement = document.getElementById("learning-button")

    // Not in learning mode, enable.
    if ( engageButtonElement.classList.contains("start-learning-button") ) {

      engageButtonElement.classList.remove("start-learning-button")
      engageButtonElement.classList.add("stop-learning-button")
      engageButtonElement.innerHTML = "Stop learning!"
      graphicsManager.toggleAlert("Learning mode started. Eve will show you the next item when the item has been graded.")
      
      if(mobileCheck()) {

        document.getElementById("sidebar").classList.remove("visible")
        document.getElementById("sidebar").classList.add("hidden")
        document.getElementById("modalbox-learning-menu").classList.remove("hidden")
        document.getElementById("content-input").classList.add("learning-mode")
  
      }

    } else {

      engageButtonElement.classList.remove("stop-learning-button")
      engageButtonElement.classList.add("start-learning-button")
      engageButtonElement.innerHTML = "Engage!"

      if(mobileCheck()) {

        document.getElementById("sidebar").classList.add("visible")
        document.getElementById("sidebar").classList.remove("hidden")
        document.getElementById("modalbox-learning-menu").classList.add("hidden")
        document.getElementById("content-input").classList.remove("learning-mode")
  
      }


    }

  }

  toggleModalFullImage(e) {

    const modalbox = document.getElementById("modalbox-image")
    const image = document.getElementById("modalbox-image-content")

    if(e.type == "mouseenter") {

      image.src = e.target.src

      const xPos = e.pageX - 600 + "px";
      const yPos = e.pageY - 700 + "px";

      modalbox.style.top = yPos;
      modalbox.style.left = xPos;

      modalbox.classList.add("visible")
      modalbox.classList.remove("hidden")

    } else if(e.type == "mouseleave") {
      modalbox.classList.remove("visible")
      modalbox.classList.add("hidden")
    }

  }

  async onWikipediaItemClicked(event) {

    await navigator.clipboard.writeText(event.target.getAttribute("data")).then(function() {
      graphicsManager.toggleAlert("Article text sent to clipboard!")
    }, function(err) {
      graphicsManager.toggleAlert(err)
    })

  }


  toggleItemSummary(event) {

    const modalbox = document.getElementById("modalbox-summary")

    if(event.type == "mouseenter") {
      modalbox.innerHTML = event.target.getAttribute("data")

      const xPos = event.pageX - 325 + "px";
      const yPos = event.pageY + 400 + "px";

      modalbox.style.top = yPos;
      modalbox.style.left = xPos;
      modalbox.classList.add("visible")
      modalbox.classList.remove("hidden")

    } else if (event.type == "mouseleave") {

      modalbox.classList.remove("visible")
      modalbox.classList.add("hidden")

    } 
    
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});

  }

  // async embedMaskedImage() {

  //   // 0. Get canvas from modalbox, check first if in occlusion mode
  //   var canvas = document.getElementById("modalbox-occlusion-create-canvas")
  //   var dataURL = canvas.toDataURL();
  //   var file = this.dataURLtoFile(dataURL, 'test.txt');
  //   var filename = await databaseManager.uploadFile(file)

  //   // Embed in the editor
  //   this.quill.insertEmbed(0, "image", "${BASE_URL}aaPg3ztScyDkfx6A.png");


  //   // 2. Embed it in the editor with help of API (do not close modalbox).

  // }




}






class DictionaryManager {

  constructor() {
  
  }

  async getRelatedWords(word, limit = 5) {

    const ENDPOINT = `https://api.datamuse.com/words?ml=${word}&max=${limit}`
    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
      },
    })

    return response.json();

  }

  async getWikipedia(word, limit = 5) {

    const ENDPOINT = `https://sv.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${word}&limit=${limit}`
    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
      },
    })

    return response.json();
  }

  async getWikipediaSummary(articleTitle) {

    const ENDPOINT = `https://sv.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${articleTitle}`
    let response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })

    return response.json()
  }




}


// Return a list with HTML-formatted answer.
async function psykologiguidenLookupWord(word) {

  const words = await psykologiguidenGetIdsByWord(word)

  let response = []
  for (const [key, value] of Object.entries(words.db)) {

    const explanation = await psykologiguidenGetExplanationByID(value.lexId)
    value.explanation = explanation.wordexplanation
    response.push(value)

  }

  console.log(response)

  return response

}

async function psykologiguidenGetExplanationByID(id){

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  myHeaders.append("Accept", "text/javascript, text/html, application/xml, text/xml, */*");
  myHeaders.append("Accept-Language", "sv-se");
  myHeaders.append("Accept-Encoding", "gzip, deflate, br");
  myHeaders.append("Host", "www.psykologiguiden.se");
  myHeaders.append('Access-Control-Allow-Origin', '*');
  myHeaders.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  myHeaders.append("Origin", "https://www.psykologiguiden.se");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15");
  myHeaders.append("Referer", "https://www.psykologiguiden.se/psykologilexikon/?Lookup=Neuron");
  myHeaders.append("Cookie", "_ga=GA1.2.835208705.1613922541; _gid=GA1.2.372964033.1613922541; ASPSESSIONIDSGASABBA=ELFJNBEBAHBOLPKDNMNNIBMN; ASPSESSIONIDQEARBABB=JDJPMKDBNIGFJOFEBJJAICEE; ASPSESSIONIDCEDSCDDC=AMPFGODBGCDCFCAEGICAAMCH; ASPSESSIONIDQGDRBAAB=KGAEPLDBGFKAMIEOALNDNMPI; ASPSESSIONIDQEDRAAAA=NIGDHPDBHAKLAMOGPIELAMCO; ASPSESSIONIDCECSBDDC=BNHDCNDBOIAOOBDNGBPLDIGP; cb-enabled=accepted; ASPSESSIONIDSGDQABAB=NDCJKJDBDKBJIPGBDKLBMFHI; ASPSESSIONIDCEDSCDDC=ENAGGODBANNGGHGALDBFCGJF; ASPSESSIONIDQEDRAAAA=AGHDHPDBFGPKEPBDGMCCICED; ASPSESSIONIDQGAQBABA=FGNDADEBMHMDFIBAKGCFENMJ");
  myHeaders.append("X-Prototype-Version", "1.7");
  myHeaders.append("X-Requested-With", "XMLHttpRequest");

  var raw = "Action=20&lexId="+id;

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'manual'
  };

  const response = await fetch("https://www.psykologiguiden.se/web/resp/lexicon/", requestOptions)
  const json = response.text()
  console.log(json)
  return json

}

async function psykologiguidenGetIdsByWord(word, count = 5){

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  myHeaders.append("Accept", "text/javascript, text/html, application/xml, text/xml, */*");
  myHeaders.append("Accept-Language", "sv-se");
  myHeaders.append("Accept-Encoding", "gzip, deflate, br");
  myHeaders.append('Access-Control-Allow-Origin', '*');
  myHeaders.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15");
  myHeaders.append("X-Prototype-Version", "1.7");
  myHeaders.append("X-Requested-With", "XMLHttpRequest");
  myHeaders.append("Cookie", "ASPSESSIONIDCEDSCDDC=ENAGGODBANNGGHGALDBFCGJF; ASPSESSIONIDQEDRAAAA=AGHDHPDBFGPKEPBDGMCCICED; ASPSESSIONIDQGAQBABA=FGNDADEBMHMDFIBAKGCFENMJ");

  
  //var raw = `Action=10&lookupWord=${word}&dbPrio=2&dbPagingItems=${count}&dbPagingPage=0`;

  var data = new URLSearchParams();
  data.append('Action', '10');
  data.append('lookupWord', 'Neuron');
  data.append('dbPrio', '2');
  data.append('dbPagingItems', '5');
  data.append('dbPagingPage', '0');

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'manual'
  };

  const response = await fetch("https://www.psykologiguiden.se/web/resp/lexicon/", requestOptions)
  return response.json()



}

async function getMeshTermByWord(word, count = 10) {

        var myHeaders = new Headers();
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("Upgrade-Insecure-Requests", "1");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.58 Safari/537.36");
        myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        myHeaders.append("Sec-Fetch-Site", "same-origin");
        myHeaders.append("Sec-Fetch-Mode", "navigate");
        myHeaders.append("Sec-Fetch-User", "?1");
        myHeaders.append("Sec-Fetch-Dest", "document");
        myHeaders.append("Referer", "https://mesh.kib.ki.se/");
        myHeaders.append("Accept-Language", "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7");
        myHeaders.append("Cookie", "_ga=GA1.2.1507998197.1613405456; _ga_VZD17KHKE3=GS1.1.1613405456.1.0.1613405457.0; _pk_id.8.fb97=decb8fc2016540c2.1613408815.; _pk_ref.8.fb97=%5B%22%22%2C%22%22%2C1613932895%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.8.fb97=1");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        const response = await fetch(`https://mesh.kib.ki.se/Mesh/search/?searchterm=${word}`, requestOptions)
        let sourcecode = await response.text()

        let parser = new DOMParser()
        let htmlDoc = parser.parseFromString(sourcecode, 'text/html');
        let items = htmlDoc.querySelectorAll("body > div > div > section > ul > li")

        let meshItems = []
        for (let i = 0; i < count; i++) {

          let href = items[i].querySelector("h3 > a").href.split("/")
          let link = "https://mesh.kib.ki.se/term/" + href[href.length-2] + "/" + href[href.length-1]
          let title = items[i].querySelector("h4").innerHTML.replace("<mark>", "")
          title = title.replace("</mark>", "")
          let description = items[i].querySelector("blockquote").innerHTML

          console.log(description)

          meshItems.push({
            "link": link,
            "title": title,
            "description": description
          })
     

        }

        return meshItems

}



Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}



// Manager to handle all aspectes of the learning.
class LearningManager{
  constructor(){
    this.isInLearningMode = false
    this.stepSize = -1
    this.recallClozeList = []
  }

  toggleExtractsInLearning() {

    graphicsManager.toggleExtractsInLearning()
    
    if (databaseManager.database.profile.showExtractsInLearningMode) 
      databaseManager.database.profile.showExtractsInLearningMode = false
    else 
      databaseManager.database.profile.showExtractsInLearningMode = true
     
  }

  toggleOcclusionsInLearning() {

    graphicsManager.toggleOcclusionsInLearning()
    
    if (databaseManager.database.profile.showOcclusionsInLearningMode) 
      databaseManager.database.profile.showOcclusionsInLearningMode = false
    else 
      databaseManager.database.profile.showOcclusionsInLearningMode = true
     
  }

  toggleClozesInLearning() {

    graphicsManager.toggleClozesInLearning()
    
    if (databaseManager.database.profile.showClozesInLearningMode) 
      databaseManager.database.profile.showClozesInLearningMode = false
    else 
      databaseManager.database.profile.showClozesInLearningMode = true
     
  }
  
  
  
  sm2(grade, repetition, efactor, interval) {

    let nextInterval = 0;
    let nextRepetition = 0;
    let nextEfactor = 0;
  
    if (grade >= 3) {
      if (repetition === 0) {
        nextInterval = 1;
        nextRepetition = 1;
      } else if (repetition === 1) {
        nextInterval = 6;
        nextRepetition = 2;
      } else {
        nextInterval = Math.round(interval * efactor);
        nextRepetition = repetition + 1;
      }
    } else {
      nextInterval = 1;
      nextRepetition = 0;
    }
  
    nextEfactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (nextEfactor < 1.3) nextEfactor = 1.3;
  
    return {
      interval: nextInterval,
      repetition: nextRepetition,
      efactor: nextEfactor,
      dueDate: new Date().addDays(nextInterval).toJSON()
    };
  }



  // getAverageEfactor() {

  //   let items = {}
  //   const l = databaseManager.database.items.filter(r => r.totalRepetitionCount > 0)


  //   for(const item of l) {

  //     if (!(item.totalRepetitionCount in items)) {

  //       items.push({
  //         repetitions: item.totalRepetitionCount,
  //         count: 1,
  //         totalEfactor: item.efactor
  //       })

  //     } else {




  //     }
  //     items[item.totalRepetitionCount].count += 1
  //     items[item.totalRepetitionCount].totalEfactor = item.efactor

  //   }

  // }






  // gradeRecordMobile(g) {

  //   const r = databaseManager.getRecordByID(graphicsManager.activeInformationID)
  //   if(learningManager.isInLearningMode) {

  //     if(r.contentType == "Occlusion")
  //       graphicsManager.toggleOcclusionLearningModal(r.id)

  //     learningManager.gradeRecord(g, r);
  //     learningManager.engage()

  //   } else {
  //     graphicsManager.toggleAlert("Please enter learning mode before grading.")
  //   }

  // }



  // Grade the Cloze or image occlusion item.
  gradeRecord(grade, record){

    // Get the updated factors from the cloze.
    let updatedFactors = this.sm2(grade, record.repetition, record.efactor, record.interval)

    // Update the record or image occlusion record in the database with updatedFactors.
    record.repetition = updatedFactors.repetition;
    record.efactor = updatedFactors.efactor;
    record.interval = updatedFactors.interval;
    record.dueDate = updatedFactors.dueDate;
  }

  toggleLearning() {

    graphicsManager.toggleLearningMode()

    if(this.isInLearningMode) {
      this.isInLearningMode = false
      const c = databaseManager.getRecordByID(graphicsManager.activeInformationID)
      graphicsManager.quill.setContents(c.content)

      if(mobileCheck()) {

        document.getElementById("sidebar").classList.add("visible")
        document.getElementById("sidebar").classList.remove("hidden")
        document.getElementById("modalbox-learning-menu").classList.add("hidden")
        document.getElementById("wrapper").classList.remove("wrapper-learning-mode")

      }

    } else {
      this.isInLearningMode = true

      if(mobileCheck()) {

        document.getElementById("sidebar").classList.add("hidden")
        document.getElementById("sidebar").classList.remove("visible")
        document.getElementById("modalbox-learning-menu").classList.remove("hidden")
        document.getElementById("wrapper").classList.add("wrapper-learning-mode")

        document.getElementById("learning-progressbar-progress").innerHTML = "Due today: " + databaseManager.getDueCount() + "(" + databaseManager.getDueCountAll() + ")"
        document.getElementById("learning-progressbar-progress").style.width = "100%"
        learningManager.stepSize = 100 / databaseManager.getDueCount()
      }
      

      this.engage()
    }

  }

  updateStatisticsItemCount() {

    let today = databaseManager.getDateToday()
    if( !(today in databaseManager.database.profile.statistics) )
      databaseManager.database.profile.statistics[today] = {}

    if(databaseManager.database.profile.statistics[today].newItemsCount == undefined) 
      databaseManager.database.profile.statistics[today].newItemsCount = 1
    else
      databaseManager.database.profile.statistics[today].newItemsCount += 1

  }

  updateStatistics() {

    let today = databaseManager.getDateToday()
    if( !(today in databaseManager.database.profile.statistics) )
      databaseManager.database.profile.statistics[today] = {}

    if(databaseManager.database.profile.statistics[today].reviewsCount == undefined) 
      databaseManager.database.profile.statistics[today].reviewsCount = 1
    else
      databaseManager.database.profile.statistics[today].reviewsCount += 1


    console.log(databaseManager.database.profile.statistics)

  }


  engage() {

    let possibleValues = []
    let dueCount = 0

    graphicsManager.sidebarUpdate()

    if (databaseManager.database.profile.showExtractsInLearningMode) {
      possibleValues.push("Extract")
      dueCount += databaseManager.getDueExtractCount()
    }

    if (databaseManager.database.profile.showOcclusionsInLearningMode) {
      possibleValues.push("Occlusion")
      dueCount += databaseManager.getDueOcclusionCount()
    }

    if (databaseManager.database.profile.showClozesInLearningMode) { 
      possibleValues.push("Cloze")
      dueCount += databaseManager.getDueClozeCount()
    }

    if (dueCount == 0 && databaseManager.getDueCount() == 0) {

      graphicsManager.toggleAlert("Well done. All repetitions done for today!")
      learningManager.toggleLearning()

      return

    } else if(dueCount == 0 && databaseManager.getDueCountAll() > 0) {

      graphicsManager.toggleAlert("Enable Clozes, Occlusion and Extract for learning mode to display all due items.")
      learningManager.toggleLearning()

      return 

    }

    let r = possibleValues[Math.floor(Math.random() * possibleValues.length)]

    if(learningManager.recallClozeList.length > 2 && mobileCheck() == false) {

      databaseManager.createFreeRecallDocument(learningManager.recallClozeList)
      graphicsManager.toggleAlert("Write everything you know about the clozes then grade the knowledge.")

    } else {

      if(r == "Occlusion") {

        let occlusion = databaseManager.getDueOcclusionRecord()
        if(occlusion !== undefined) {

          occlusion.repetition += 1
          occlusion.totalRepetitionCount += 1
          this.updateStatistics()
          graphicsManager.activeInformationID = occlusion.id
          graphicsManager.toggleOcclusionLearningModal(occlusion.id)
          graphicsManager.expandAllParentsToID(occlusion.id)
          graphicsManager.HighlightItemInSidebarByID(occlusion.id)

        } else {
            this.engage()
        }
      } else if (r == "Cloze") {

        let cloze = databaseManager.getDueClozeRecord()
        if(cloze !== undefined) {

          cloze.repetition += 1
          cloze.totalRepetitionCount += 1
          this.updateStatistics()
          graphicsManager.renderInputBox(cloze)
          graphicsManager.expandAllParentsToID(cloze.id)
          graphicsManager.HighlightItemInSidebarByID(cloze.id)


          let tempObj = cloze.content.ops
          Object.keys(tempObj).map(function(key, index) {

            //console.log(tempObj[key].insert)

            if (tempObj[key].insert.trim().includes("!:Q")) {
              
              // console.log("Valid query!")
              // console.log(tempObj[key])
              learningManager.recallClozeList.push(tempObj[key])
              //console.log(learningManager.recallClozeList)

            
            } else {
              console.log("Does not contains !:Q")
            }

          });

          // Check if cloze correctly formatted for free recall.
          // if (cloze.content.contains("!:Q")) {
          //   graphicsManager.includes("Item is free recall compatible.")
          //   learningManager.recallClozeIDList.push(cloze.id)
          // }

        } else {
          this.engage()
        }

      } else if (r == "Extract") {

        let extract = databaseManager.getDueExtractRecord()
        if(extract !== undefined) {

          extract.repetition += 1
          extract.totalRepetitionCount += 1
          this.updateStatistics()
          graphicsManager.renderInputBox(extract)
          graphicsManager.expandAllParentsToID(extract.id)
          graphicsManager.HighlightItemInSidebarByID(extract.id)

        } else {
          this.engage()
        }

      }

    }

  }



}





// Generate a random id of length X.
function createID(length = 6) {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}


// window.addEventListener("beforeunload", function (e) {
//   //databaseManager.saveLocalDatabaseOnClose()

//   databaseManager.saveLocalDatabase()
//   sleep(10000);

//   // databaseManager.saveLocalDatabase()
//   // sleep(3000)
//   // return "Please wait five seconds before leaving website to save the database.";
// })

// window.addEventListener("beforeunload", (e) => {
//   databaseManager.saveLocalDatabaseOnClose()

// })

// document.getElementById("content-input").addEventListener("paste", async (event) => {

//   const i = event.clipboardData.items[0]
//   if (i.type == "text/plain" || i.type == "text/html") {

//     let r = databaseManager.getRecordByID(graphicsManager.activeInformationID)
    
//     r.content = graphicsManager.quill.getContents()

//     console.log("Active ID: " + graphicsManager.activeInformationID)
//     console.log(graphicsManager.quill.getText())

//     await databaseManager.saveLocalDatabase()


//   }

// })

let handleDocumentImport = async e => {

  let f = ""
  if(e.type == "drop")
    f = e.dataTransfer.files[0]
  else if (e.type == "paste")
    f = e.clipboardData.items[0]

  if (["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(f.type)) {

    e.preventDefault();

    if (f.type == "application/pdf") {

      const content = await getPdfText(filepath)
      const id = createID(4) + "(PDF)"
      databaseManager.createFolder(id)
      databaseManager.createText(id + "/" + createID(4), [{insert: content}])
      graphicsManager.toggleAlert("PDF imported to new folder: " + id, "success")

    } else {


      let imageFile = ""
      if (e.type == "drop")
        imageFile = e.dataTransfer.files[0]
      else if (e.type == "paste")
        imageFile = e.clipboardData.files[0]

      console.log(e)
      console.log(imageFile)

      let image = new Image()
      image.crossOrigin = "anonymous"
      reader = new FileReader()
      reader.onload = function(e) {
        image.src = e.target.result
      };

      reader.readAsDataURL(imageFile)
      image.onload = () =>  graphicsManager.updateOcclusionCreateCanvas(image)

      const filename = createID(6) + "." + imageFile.type.split("/")[1] 
      graphicsManager.lastActiveImageOcclusionURL = filename
      const path = BASE_URL + filename
      const response = await databaseManager.uploadFile(imageFile, path)
      console.log("Upload completed: " + response)

    }

  } else {

    if (f.type != "text/html" && f.type != "text/plain")
      graphicsManager.toggleAlert("Paste format is not supported: " + f.type, "warning")
  
  }

  // if (["image/png", "image/jpgiteg", "image/webp", "application/pdf"].includes(event.dataTransfer.files[0].type)) {
  //   event.preventDefault();
  //   let filename = await databaseManager.uploadFile(file);
  //   let filepath = BASE_URL + filename
  //   if (file.type == "application/pdf") {
  //     const content = await getPdfText(filepath)
  //     const id = createID(4) + "(PDF)"
  //     databaseManager.createFolder(id)
  //     databaseManager.createText(id + "/" + createID(4), [{insert: content}])
  //     this.toggleAlert("PDF imported to new folder: " + id)
  //     console.log(content)
  //   }
  // }
  // databaseManager.saveLocalDatabase()


}


document.addEventListener("paste", async (event) => {

  handleDocumentImport(event)

})


// Handle right click events with modal.
document.addEventListener("contextmenu", (event) => {

  // Set the graphicsManager last clicked item.
  graphicsManager.lastRightClickedItemID = event.target.getAttribute("data-id");
  const r = databaseManager.getRecordByID(graphicsManager.lastRightClickedItemID)

  event.preventDefault();
  event.stopPropagation();

  const xPos = event.pageX + "px";
  const yPos = event.pageY + "px";
  
  let modalWindow = document.getElementById("modalbox-contextmenu");
  modalWindow.classList.remove("hidden");
  modalWindow.classList.add("visible");
  modalWindow.style.top = yPos;
  modalWindow.style.left = xPos;

  // Add event listener to remove the contextmenu.
  document.body.addEventListener("click", (event) => {

    let modalWindow = document.getElementById("modalbox-contextmenu");
    modalWindow.classList.remove("visible");
    modalWindow.classList.add("hidden");

    document.getElementById("contextmenu-create-folder").classList.add("hidden")
    document.getElementById("contextmenu-create-text").classList.add("hidden")
    document.getElementById("contextmenu-remove-item").classList.add("hidden")
    document.getElementById("contextmenu-rename-item").classList.add("hidden")
    document.getElementById("contextmenu-duplicate-item").classList.add("hidden")
    document.getElementById("contextmenu-create-folder").classList.add("hidden")
    document.getElementById("contextmenu-create-text").classList.add("hidden")
    document.getElementById("contextmenu-postpone-7days").classList.add("hidden")

    if(r.isFlagged)
      document.getElementById("contextmenu-flag-item").classList.add("hidden")
    else
      document.getElementById("contextmenu-unflag-item").classList.add("hidden")


    //document.getElementById("contextmenu-postpone-30days").classList.add("hidden")

    document.getElementById("contextmenu-import-database").classList.add("hidden")
    document.getElementById("contextmenu-export-database").classList.add("hidden")

  }, {once:true})


  if (event.target.id == "content-structure") {

    // Clicked outside of item in the left sidebar. Show all options with class.
    document.getElementById("contextmenu-create-folder").classList.remove("hidden")
    document.getElementById("contextmenu-create-text").classList.remove("hidden")

    document.getElementById("contextmenu-import-database").classList.remove("hidden")
    document.getElementById("contextmenu-export-database").classList.remove("hidden")

  } else if (event.target.id != "content-structure" && r !== undefined) {

    // Clicked at an item in the left sidebar. Show all available options with class.
    document.getElementById("contextmenu-remove-item").classList.remove("hidden")
    document.getElementById("contextmenu-rename-item").classList.remove("hidden")
    document.getElementById("contextmenu-duplicate-item").classList.remove("hidden")
    document.getElementById("contextmenu-create-folder").classList.remove("hidden")
    document.getElementById("contextmenu-create-text").classList.remove("hidden")
    document.getElementById("contextmenu-postpone-7days").classList.remove("hidden")

    if(r.isFlagged)
      document.getElementById("contextmenu-unflag-item").classList.remove("hidden")
    else
      document.getElementById("contextmenu-flag-item").classList.remove("hidden")

    //document.getElementById("contextmenu-sidebar-right-import-article").classList.add("hidden")
    //document.getElementById("contextmenu-sidebar-right-import-clipboard").classList.add("hidden")
    //document.getElementById("contextmenu-sidebar-right-create-occlusion").classList.add("hidden")
    //document.getElementById("contextmenu-postpone-30days").classList.remove("hidden")

  } else if (event.target.id.includes("sidebar-right-item-")) {

    graphicsManager.lastRightClickedSimilarContentID = event.target.id

    document.getElementById("contextmenu-remove-item").classList.add("hidden")
    document.getElementById("contextmenu-rename-item").classList.add("hidden")
    document.getElementById("contextmenu-duplicate-item").classList.add("hidden")
    document.getElementById("contextmenu-create-folder").classList.add("hidden")
    document.getElementById("contextmenu-create-text").classList.add("hidden")
    document.getElementById("contextmenu-postpone-7days").classList.add("hidden")

    document.getElementById("contextmenu-sidebar-right-import-article").classList.remove("hidden")
    //document.getElementById("contextmenu-sidebar-right-import-clipboard").classList.remove("hidden")
    document.getElementById("contextmenu-sidebar-right-create-occlusion").classList.remove("hidden")

  }

  console.log(event.target.id)


})



document.getElementById("header-explorer-button").addEventListener("click", e => {

  graphicsManager.renderExplorer()

  document.getElementById("overlay").classList.add("visible")
  document.getElementById("overlay").classList.remove("hidden")

  document.getElementById("modalbox-explorer").classList.remove("hidden")
  document.getElementById("modalbox-explorer").classList.add("visible")
  
})

document.getElementById("header-flagged-button").addEventListener("click", e => {

  graphicsManager.renderFlagged()

  document.getElementById("overlay").classList.add("visible")
  document.getElementById("overlay").classList.remove("hidden")

  document.getElementById("modalbox-flagged").classList.remove("hidden")
  document.getElementById("modalbox-flagged").classList.add("visible")
  
})

document.getElementById("header-statistics-button").addEventListener("click", e => {

  document.getElementById("overlay").classList.add("visible")
  document.getElementById("overlay").classList.remove("hidden")
  graphicsManager.toggleStatisticsModal()
  
})


// document.getElementById("header-priority-button").addEventListener("click", e => {

//   graphicsManager.renderPriority()

//   document.getElementById("overlay").classList.add("visible")
//   document.getElementById("overlay").classList.remove("hidden")

//   document.getElementById("modalbox-priority").classList.remove("hidden")
//   document.getElementById("modalbox-priority").classList.add("visible")
  
// })




// Event handler for public mode.
document.getElementById("modalbox-settings-database-shared-checkbox").addEventListener("change", async e => {

  await graphicsManager.toggleDatabaseShare()

})
document.getElementById("modalbox-settings-ui-sidebar-show-checkbox").addEventListener("change", e => {

  databaseManager.toggleRightSidebar()

})
document.getElementById("modalbox-settings-ui-sidebar-image-checkbox").addEventListener("change", e => {

  databaseManager.toggleImagesInSidebar()
  graphicsManager.renderFolders()

})


document.getElementById("modalbox-settings-learning-extracts-checkbox").addEventListener("change", e => {
  
  databaseManager.database.profile.showExtractsInLearningMode = e.checked

})
document.getElementById("modalbox-settings-learning-occlusions-checkbox").addEventListener("change", e => {

  databaseManager.database.profile.showOcclusionsInLearningMode = e.checked

})
document.getElementById("modalbox-settings-learning-clozes-checkbox").addEventListener("change", e => {

  databaseManager.database.profile.showClozesInLearningMode = e.checked

})


document.getElementById("extract-selection-color-picker").addEventListener("change", e => {

  databaseManager.database.profile.extractHighlightColor = e.target.value

})
document.getElementById("cloze-selection-color-picker").addEventListener("change", e => {

  databaseManager.database.profile.clozeHighlightColor = e.target.value

})






document.getElementById("header-database-button").addEventListener("click", e => {

  graphicsManager.renderDatabases()

  document.getElementById("overlay").classList.add("visible")
  document.getElementById("overlay").classList.remove("hidden")

  document.getElementById("modalbox-databases").classList.remove("hidden")
  document.getElementById("modalbox-databases").classList.add("visible")
  
})


function setTheme(theme = "homebrew") {

  console.log("Theme set to: " + theme)

  if (theme == "homebrew")
    document.getElementById("darkmode-text").innerHTML = "Light mode"
  else
  document.getElementById("darkmode-text").innerHTML = "Dark mode"

  // Add filter to all images
  const images = document.querySelectorAll("img")
  images.forEach.call(images, function(image) {
    
    image.classList.remove("filter-day")
    image.classList.remove("filter-night")
    image.classList.remove("filter-homebrew")

    if(theme !== "day")
    image.classList.add("filter-"+theme)

  });

  const fontColor = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-font-color')
  const fontColorButton = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-font-color_button')

  const backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-background-color')
  const backgroundColorSidebar = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-background-color_sidebar')
  const backgroundColorModalbox = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-background-color_modalbox')
  const backgroundColorButton = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-background-color_button')
  const backgroundColorButtonHover = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-background-color_button-hover')
  const backgroundColorCheckbox = window.getComputedStyle(document.documentElement).getPropertyValue('--'+theme+'-background-color_checkbox')

  document.documentElement.style.setProperty('--font-color', fontColor);
  document.documentElement.style.setProperty('--font-color_button', fontColorButton)

  document.documentElement.style.setProperty('--background-color', backgroundColor)
  document.documentElement.style.setProperty('--background-color_sidebar', backgroundColorSidebar)
  document.documentElement.style.setProperty('--background-color_modalbox', backgroundColorModalbox)
  document.documentElement.style.setProperty('--background-color_button', backgroundColorButton)
  document.documentElement.style.setProperty('--background-color_button-hover', backgroundColorButtonHover)
  document.documentElement.style.setProperty('--background-color_checkbox', backgroundColorCheckbox)

}

document.getElementById("header-darkmode-button").addEventListener("click", e => {

  if(databaseManager.database.profile.theme == "day") {
    databaseManager.database.profile.theme = "homebrew"
    setTheme("homebrew")
  } else {
    databaseManager.database.profile.theme = "day"
    setTheme("day")
  }


})


// document.getElementById("header-zenmode-button").addEventListener("click", e => {

//   graphicsManager.isNotZenModeEnabled = !graphicsManager.isNotZenModeEnabled;

//   if (graphicsManager.isNotZenModeEnabled) {
//     document.documentElement.style.setProperty('--zen-opacity', "1");
//   } else {
//     document.documentElement.style.setProperty('--zen-opacity', "0");
//   }

// })

document.getElementById("header-settings-button").addEventListener("click", e => {

  profileManager.update();  // Sync visible data to database.

  document.getElementById("overlay").classList.add("visible")
  document.getElementById("overlay").classList.remove("hidden")

  document.getElementById("modalbox-shortcuts").classList.remove("hidden")

  document.getElementById("modalbox-settings-container").classList.remove("hidden")
  document.getElementById("modalbox-settings-container").classList.add("visible-grid")

})


document.getElementById("mainwindow-padding-slider").addEventListener("input", e => {

  databaseManager.database.profile.mainWindowPadding = e.target.value
  document.documentElement.style.setProperty('--mainWindow-padding', e.target.value + "px");
  console.log(document.documentElement.style.getPropertyValue("--mainWindow-padding"))

})
document.getElementById("leftsidebar-padding-slider").addEventListener("input", e => {

  databaseManager.database.profile.leftSidebarPadding = e.target.value
  document.documentElement.style.setProperty('--leftSidebar-padding', e.target.value + "px");
  console.log(document.documentElement.style.getPropertyValue("--leftSidebar-padding"))

})
document.getElementById("rightsidebar-padding-slider").addEventListener("input", e => {

  databaseManager.database.profile.rightSidebarPadding = e.target.value
  document.documentElement.style.setProperty('--rightSidebar-padding', e.target.value + "px");
  console.log(document.documentElement.style.getPropertyValue("--rightSidebar-padding"))

})




document.onkeydown = function(e){
  e = e || window.event;
  keycode = e.which || e.keyCode;

  const grade1S = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item1")
  const grade2S = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item2")
  const grade3S = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item3")
  const grade4S = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item4")
  const grade5S = databaseManager.database.profile.shortcuts.find(r => r.event == "input-grade-item5")

  const toggleSpotlightS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-spotlight-toggle")
  const showOcclusionS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-show-occlusion")
  const removeItemS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-remove-item")
  const renameItemS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-rename-item")
  const duplicateItemS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-duplicate-item")
  const createFolderS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-folder")
  const createTextS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-text")
  const createOcclusionS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-occlusion")
  const createSeparateOcclusionS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-create-occlusion-separate")
  const flagItemS = databaseManager.database.profile.shortcuts.find(r => r.event == "input-flag-item")

  const r = databaseManager.getRecordByID(graphicsManager.activeInformationID)


  if(keycode == 27) {
    graphicsManager.toggleSpotlight()
  }

  if (keycode == showOcclusionS.keyCode &&
    (e.ctrlKey == showOcclusionS.ctrlKey ||
    e.metaKey == showOcclusionS.metaKey) &&
    e.altKey == showOcclusionS.altKey &&
    learningManager.isInLearningMode) {

      e.preventDefault()

      if(r.contentType == "Occlusion")
        graphicsManager.updateOcclusionLearnCanvas(r.id, false);
      else
        graphicsManager.renderClozure(r)

  }
  
  if (keycode == toggleSpotlightS.keyCode &&
    (e.ctrlKey == toggleSpotlightS.ctrlKey ||
    e.metaKey == toggleSpotlightS.metaKey) &&
    e.altKey == toggleSpotlightS.altKey) {

      e.preventDefault()
      graphicsManager.toggleSpotlight()

  } else if (keycode == flagItemS.keyCode &&
    (e.ctrlKey == flagItemS.ctrlKey ||
    e.metaKey == flagItemS.metaKey) &&
    e.altKey == flagItemS.altKey) {

      e.preventDefault()
      databaseManager.flagItemID(r.id)
      learningManager.engage()

  } else if (keycode == removeItemS.keyCode &&
    (e.ctrlKey == removeItemS.ctrlKey ||
    e.metaKey == removeItemS.metaKey) &&
    e.altKey == removeItemS.altKey) {

      e.preventDefault()
      graphicsManager.removeItem()
      graphicsManager.renderFolders()

  } else if (keycode == duplicateItemS.keyCode &&
    (e.ctrlKey == duplicateItemS.ctrlKey ||
    e.metaKey == duplicateItemS.metaKey) &&
    e.altKey == duplicateItemS.altKey) {

      e.preventDefault()
      graphicsManager.duplicateItem()
      graphicsManager.renderFolders()

  } else if (keycode == renameItemS.keyCode &&
    (e.ctrlKey == renameItemS.ctrlKey ||
    e.metaKey == renameItemS.metaKey) &&
    e.altKey == renameItemS.altKey) {

      e.preventDefault()
      graphicsManager.renameItem()
      graphicsManager.renderFolders()

  } else if(keycode == createFolderS.keyCode &&
    (e.ctrlKey == createFolderS.ctrlKey ||
    e.metaKey == createFolderS.metaKey) &&
    e.altKey == createFolderS.altKey) {

      e.preventDefault()
      graphicsManager.createFolder()
      graphicsManager.renderFolders()

  } else if(keycode == createTextS.keyCode &&
    (e.ctrlKey == createTextS.ctrlKey ||
    e.metaKey == createTextS.metaKey) &&
    e.altKey == createTextS.altKey) {

      e.preventDefault()
      graphicsManager.createText()
      graphicsManager.renderFolders()

  } else if(keycode == createOcclusionS.keyCode &&
    (e.ctrlKey == createOcclusionS.ctrlKey ||
    e.metaKey == createOcclusionS.metaKey) &&
    e.altKey == createOcclusionS.altKey) {

      e.preventDefault()

      databaseManager.addImageOcclusions(false, graphicsManager.lastActiveImageOcclusionURL, graphicsManager.activeOcclusionsList);
      graphicsManager.renderFolders()

  } else if(keycode == createSeparateOcclusionS.keyCode &&
    (e.ctrlKey == createSeparateOcclusionS.ctrlKey ||
    e.metaKey == createSeparateOcclusionS.metaKey) &&
    e.altKey == createSeparateOcclusionS.altKey) {

      e.preventDefault();

      databaseManager.addImageOcclusions(true, graphicsManager.lastActiveImageOcclusionURL, graphicsManager.activeOcclusionsList);
      graphicsManager.renderFolders()
    

  } else if(keycode == grade1S.keyCode &&
    (e.ctrlKey == grade1S.ctrlKey ||
    e.metaKey == grade1S.metaKey) &&
    e.altKey == grade1S.altKey &&
    learningManager.isInLearningMode) {

      e.preventDefault();

      if(r.contentType == "Occlusion")
        graphicsManager.toggleOcclusionLearningModal(r.id)

      learningManager.gradeRecord(1, r);
      learningManager.engage()

  } else if(keycode == grade2S.keyCode &&
    (e.ctrlKey == grade2S.ctrlKey ||
    e.metaKey == grade2S.metaKey) &&
    e.altKey == grade2S.altKey &&
    learningManager.isInLearningMode) {

      e.preventDefault();

      if(r.contentType == "Occlusion")
        graphicsManager.toggleOcclusionLearningModal(r.id)

      learningManager.gradeRecord(2, r);
      learningManager.engage()

  } else if(keycode == grade3S.keyCode &&
    (e.ctrlKey == grade3S.ctrlKey ||
    e.metaKey == grade3S.metaKey) &&
    e.altKey == grade3S.altKey &&
    learningManager.isInLearningMode) {

      e.preventDefault();

      if(r.contentType == "Occlusion")
        graphicsManager.toggleOcclusionLearningModal(r.id)

      learningManager.gradeRecord(3, r);
      learningManager.engage()

  } else if(keycode == grade4S.keyCode &&
    (e.ctrlKey == grade4S.ctrlKey ||
    e.metaKey == grade4S.metaKey) &&
    e.altKey == grade4S.altKey &&
    learningManager.isInLearningMode) {

      e.preventDefault();
      
      if(r.contentType == "Occlusion")
        graphicsManager.toggleOcclusionLearningModal(r.id)

      learningManager.gradeRecord(4, r);
      learningManager.engage()

  } else if(keycode == grade5S.keyCode &&
    (e.ctrlKey == grade5S.ctrlKey ||
    e.metaKey == grade5S.metaKey) &&
    e.altKey == grade5S.altKey &&
    learningManager.isInLearningMode) {

      e.preventDefault();

      if(r.contentType == "Occlusion")
        graphicsManager.toggleOcclusionLearningModal(r.id)

      learningManager.gradeRecord(5, r);
      learningManager.engage()
  }



}





document.getElementById("modalbox-login-username").addEventListener("click", function(e) {
  this.select()
})

document.getElementById("modalbox-login-button").addEventListener("click", function() {

  let email = document.getElementById("modalbox-login-username").value
  let password = document.getElementById("modalbox-login-password").value
  databaseManager.login(email, password)

})

document.getElementById("modalbox-tutorial-next").addEventListener("click", function(e) {

  graphicsManager.stepTutorial()

})
document.getElementById("modalbox-tutorial-previous").addEventListener("click", function(e) {

  graphicsManager.stepTutorial(false)

})



document.getElementById("modalbox-changelog-button").addEventListener("click", function(e) {

  if(document.getElementById("modalbox-changelog").classList.contains("visible")) {

    databaseManager.database.profile.changelogViewed = true

    document.getElementById("overlay").classList.remove("visible")
    document.getElementById("overlay").classList.add("hidden")
    document.getElementById("modalbox-changelog").classList.remove("visible")
    document.getElementById("modalbox-changelog").classList.add("hidden")

  }

})




document.getElementById("overlay").addEventListener("click", function() {


  if(learningManager.isInLearningMode) {
  
    learningManager.toggleLearning()
    graphicsManager.toggleAlert("Learning mode ended.")
  
  }

  if(document.getElementById("modalbox-changelog").classList.contains("hidden") == false) {

    console.log("Accepted changelog!")
    databaseManager.database.profile.changelogViewed = true
    document.getElementById("modalbox-changelog").classList.remove("visible")
    document.getElementById("modalbox-changelog").classList.add("hidden")

  }


  if(document.getElementById("modalbox-login").classList.contains("visible")) {

    graphicsManager.toggleAlert("Please enter an ID to login or generate a new account.")

  } else if (document.getElementById("modalbox-tos").classList.contains("visible")) {
  
    graphicsManager.toggleAlert("You have to read and accept the terms of agreement in order to continue using Evecloud.")

  } else if (document.getElementById("modalbox-tutorial").classList.contains("hidden") == false) {

      graphicsManager.toggleAlert("You have to complete the tutorial, go to the last page and click complete tutorial.")

  }
  else {

    // Hide overlay when clicked.
    document.getElementById("overlay").classList.remove("visible");
    document.getElementById("overlay").classList.add("hidden");

    // Hide modalbox for login
    document.getElementById("modalbox-login").classList.remove("visible");
    document.getElementById("modalbox-login").classList.add("hidden");

    // Hide modalbox for contextmenu.
    document.getElementById("modalbox-contextmenu").classList.remove("visible");
    document.getElementById("modalbox-contextmenu").classList.add("hidden");

    // Hide image occlusion modalbox.
    document.getElementById("modalbox-occlusion-learning").classList.remove("visible");
    document.getElementById("modalbox-occlusion-learning").classList.add("hidden");

    // Hide the image occlusion modalbox for creation.
    document.getElementById("modalbox-occlusion-create").classList.remove("visible");
    document.getElementById("modalbox-occlusion-create").classList.add("hidden");

    // Hide the settings modalbox.
    document.getElementById("modalbox-settings-container").classList.remove("visible");
    document.getElementById("modalbox-settings-container").classList.add("hidden");

    // Hide the database modalbox.
    document.getElementById("modalbox-databases").classList.remove("visible");
    document.getElementById("modalbox-databases").classList.add("hidden");

    // Hide the item explorer modalbox.
    document.getElementById("modalbox-explorer").classList.remove("visible");
    document.getElementById("modalbox-explorer").classList.add("hidden");

    // Hide the item explorer modalbox.
    document.getElementById("modalbox-flagged").classList.remove("visible");
    document.getElementById("modalbox-flagged").classList.add("hidden");

    // Hide the statistics modalbox.
    document.getElementById("modalbox-statistics").classList.remove("visible");
    document.getElementById("modalbox-statistics").classList.add("hidden");

    // Remove active element from sidebar.
    document.querySelectorAll(".active").forEach((node) => {
      node.classList.remove("active")
    })

    // Clear the content of the temporary list of all occlusion information.
    graphicsManager.activeOcclusionsList = []

  }

})



// Manager to handle all aspects of the database
let databaseManager = new DatabaseManager();
// Manager to handele all graphics updates.
let graphicsManager = new GraphicsManager();
// Manager to handle all aspects of learning.
let learningManager = new LearningManager();
// Manager to handle profile.
let profileManager = new ProfileManager();
// Handle everything in regards to Oxford dictionary.
let dictionaryManager = new DictionaryManager();
// Handle everything in regards to keyboard events.
//let apiManager = new ApiManager();

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


function onGradeItemClicked(e) {


      console.log(e.target.id)

      if (["modalbox-occlusion-learning-canvas", "learning-btn1", "learning-btn2", "learning-btn3",
      "learning-btn4", "learning-btn5", "learning-btn6", "learning-btn7", "learning-flag-item", "learning-show-answer"].includes(e.target.id)) {

        if (learningManager.isInLearningMode) {

          e.stopPropagation(); // Stop event bubbling.
          e.preventDefault(); // Prevent default behaviour

          const r = databaseManager.getRecordByID(graphicsManager.activeInformationID)
         
          if (
                e.target.id != "learning-show-answer" &&
                e.target.id != "modalbox-occlusion-learning-canvas"
          ) {

            if(r.isFlagged)
              document.getElementById("learning-flag-item").src = "img/flag.svg"
            else 
              document.getElementById("learning-flag-item").src = "img/unflag.svg"


            const elem = document.getElementById("learning-progressbar-progress")
            let w = (elem.style.width.replace("%","") - learningManager.stepSize)+"%"
          
            elem.innerHTML = "Due today: " + databaseManager.getDueCount() + "(" + databaseManager.getDueCountAll() + ")"
            elem.style.width = w
          }

          if (e.target.id == "learning-btn1") {

            e.preventDefault();

            if(r.contentType == "Occlusion")
              graphicsManager.toggleOcclusionLearningModal(r.id)

            learningManager.gradeRecord(1, r);
            learningManager.engage()

          }
          
          if (e.target.id == "learning-btn2") {

            e.preventDefault();

            if(r.contentType == "Occlusion")
              graphicsManager.toggleOcclusionLearningModal(r.id)

            learningManager.gradeRecord(2, r);
            learningManager.engage()

          }

          if (e.target.id == "learning-btn3") {

            e.preventDefault();

            if(r.contentType == "Occlusion")
              graphicsManager.toggleOcclusionLearningModal(r.id)

            learningManager.gradeRecord(3, r);
            learningManager.engage()

          }

          if (e.target.id == "learning-btn4") {

            e.preventDefault();

            if(r.contentType == "Occlusion")
              graphicsManager.toggleOcclusionLearningModal(r.id)

            learningManager.gradeRecord(4, r);
            learningManager.engage()

          }

          if (e.target.id == "learning-btn5") {

            e.preventDefault();

            if(r.contentType == "Occlusion")
              graphicsManager.toggleOcclusionLearningModal(r.id)

            learningManager.gradeRecord(5, r);
            learningManager.engage()

          }

          if (e.target.id == "learning-btn6" ||
              e.target.id == "learning-show-answer" ||
              e.target.id == "modalbox-occlusion-learning-canvas") {
            
            if(r.contentType == "Occlusion")
              graphicsManager.updateOcclusionLearnCanvas(r.id, false);
            else if (r.contentType == "Cloze")
              graphicsManager.renderClozure(r)
            else 
              graphicsManager.toggleAlert("Need to be cloze or occlusion item.")

          }

          if (e.target.id == "learning-btn7" || e.target.id == "learning-flag-item" ) {
            
            if (r.isFlagged)
              databaseManager.flagItemByID(r.id, false)
            else
              databaseManager.flagItemByID(r.id, true)

            learningManager.engage()

          }


        } else {
          graphicsManager.toggleAlert("Enter learning mode before grading.", "warning")
        }

      }
  
}


async function getPdfText(data = "https://f003.backblazeb2.com/file/evedevelopment/La%CC%88randema%CC%8Al.pdf") {
  let doc = await pdfjsLib.getDocument(data).promise;
  let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {


      window.objs = []
      page.getOperatorList().then(function (ops) {
          for (var i=0; i < ops.fnArray.length; i++) {
              if (ops.fnArray[i] == PDFJS.OPS.paintJpegXObject) {
                  window.objs.push(ops.argsArray[i][0])
              }
          }
      })

      console.log(window.args.map(function (a) { page.objs.get(a) }))

      return (await (await doc.getPage(i+1)).getTextContent()).items.map(token => token.str).join('');
  
  
    });
  return (await Promise.all(pageTexts)).join('???????');
}

function readPDF(url = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf") {

  var pdfjsLib = window['pdfjs-dist/build/pdf'];
  var loadingTask = pdfjsLib.getDocument(url);
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
  
  loadingTask.promise.then(function(pdf) {

    console.log(pdfjsLib)

    for (var i = 1; i <= maxPages; i++) {

        pdf.getPage(i).then(function(page) {

              var txt = "";
              var textContent = page.getTextContent();
              console.log(textContent)
        })

    }
          
  });

}




// Entry point of script file.
window.onload = async function() {
  

  document.addEventListener("touchend", onGradeItemClicked, false)
  document.addEventListener("click", onGradeItemClicked, false)

  if (await localforage.getItem("username")) {

    const username = await localforage.getItem("username")
    const password  = await localforage.getItem("password")
    databaseManager.login(username, password)



  }


}