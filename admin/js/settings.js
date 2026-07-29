/* =====================================
   SETTINGS
===================================== */

const form = document.getElementById("settingsForm");
let savedSettings = {};
let selectedLogo = null;

const logoInput = document.getElementById("logo");

logoInput.addEventListener("change",(e)=>{

    if(!e.target.files.length) return;

    selectedLogo = e.target.files[0];

    document.getElementById("logoPreview").src =
        URL.createObjectURL(selectedLogo);

});

async function loadSettings() {

    const { data, error } = await db
        .from("settings")
        .select("*");

    if (error) {

        console.error(error);

        return;

    }

    data.forEach(setting => {
        savedSettings[setting.key] = setting.value;

        const input = document.getElementById(setting.key);

        if (!input) return;

if(setting.key=="logo"){

    document.getElementById("logoPreview").src =
        setting.value;

}
else{

    input.value = setting.value ?? "";

}
    });

}
async function uploadLogo(file){

    const fileName = `logo-${Date.now()}.${file.name.split(".").pop()}`;

    const { error } = await db.storage
        .from("assets")
        .upload(fileName,file,{
            upsert:true
        });

    if(error){

        console.error(error);

        return;

    }

    const { data } = db.storage
        .from("assets")
        .getPublicUrl(fileName);

    await db
        .from("settings")
        .update({
            value:data.publicUrl
        })
        .eq("key","logo");

    document.getElementById("logoPreview").src =
        data.publicUrl;

}

async function saveSettings(e){

    e.preventDefault();

    console.log("Save button clicked");

    if(selectedLogo){

        await uploadLogo(selectedLogo);

        selectedLogo = null;

    }

    const settings = [

        "company_name",
        "website_title",
        "website_description",
        "email",
        "phone",
        "whatsapp",
        "address"

    ];

    for(const key of settings){

        const value = document.getElementById(key).value;

        const { data, error } = await db
            .from("settings")
            .update({
                value: value,
                updated_at: new Date().toISOString()
            })
            .eq("key", key)
            .select();

        console.log("Updating:", key);
        console.log("Returned:", data);
        console.log("Error:", error);

        if(error){
            console.error(error);
        }

    }

    await loadSettings();

    alert("Settings Saved ✔");

}

form.addEventListener("submit",saveSettings);

document.getElementById("resetSettings").addEventListener("click",()=>{

    Object.keys(savedSettings).forEach(key=>{

        if(key==="logo"){

    document.getElementById("logoPreview").src =
        savedSettings[key];

    selectedLogo = null;

    document.getElementById("logo").value = "";

    return;

}

        const input = document.getElementById(key);

        if(input){

            input.value = savedSettings[key] ?? "";

        }

    });

});

loadSettings();