function createInputField(name, value) {
  return `<div class="flex mt-6"><label class="flex items-center" for="form-input-${name}">
        <input type="checkbox" class="form-checkbox" id="form-input-${name}" ${
    value ? "checked" : ""
  } name="${name}" /><span class="ml-2">${name}</span>
       </label>
    </div>`;
}
function createSubmitButton() {
  return `<div class="flex mt-6">
    <input type="submit" class="btn-primary transition duration-300 ease-in-out focus:outline-none focus:shadow-outline bg-purple-700 hover:bg-purple-900 text-white font-normal py-2 px-4 mr-1 rounded block" value="Save" />
    </div>`;
}

function init_options() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      {
        properties: [],
      },
      (items) => {
        $.getJSON("/plugins/css-properties.json", function (data) {
          let selectOptions = "";
          Object.entries(data).forEach((el) => {
            selectOptions += `<option name="${el[0]}" ${
              items.properties.includes(el[0]) ? "selected" : ""
            }>${el[0]}</option>`;
          });
          $("#select").html(selectOptions);
          $("#select").select2();
          $("#select").on("select2:select select2:unselect", function (e) {
            $("#options-page-form").submit();
          });
          resolve(items.properties);
        }).fail(function () {
          console.log("An error has occurred.");
          reject();
        });
      }
    );
  });
}
function init_settings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      {
        showHighlight: true,
      },
      function (items) {
        if (items.showHighlight) {
          $("#showHightlight").attr("checked", true);
        }
        $("#showHightlight").on("change", function () {
          $("#options-page-settings").submit();
        });
        resolve();
      }
    );
  });
}
$(document).ready(function () {
  init_options().then((items) => {
    init_settings();
    $("#options-page-settings").on("submit", function (e) {
      e.preventDefault();
      const formdata = $(this).serializeArray().length !== 0;
      chrome.storage.sync.set(
        {
          showHighlight: formdata,
        },
        function () {
          iziToast.show({
            title: "Saved!",
            message: "Your preferences have been updated",
            color: "green",
          });
        }
      );
    });
    $("#options-page-form").on("submit", function (e) {
      e.preventDefault();
      const formdata = $(this).serializeArray();
      chrome.storage.sync.set(
        {
          properties: formdata.map((el) => el.value),
        },
        function () {
          iziToast.show({
            title: "Saved!",
            message: "Your preferences have been updated",
            color: "green",
          });
        }
      );
    });
  });
});
