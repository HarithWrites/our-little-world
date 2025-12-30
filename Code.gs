function doPost(e) {
  const b = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActive();

  if (b.action === "login") {
    const rows = ss.getSheetByName("Couples").getDataRange().getValues();
    const user = rows.find(r => r[0] == b.code && r[1] == b.pin);
    return json({ ok: !!user, names: user?.[2] });
  }

  if (b.action === "create") {
    const sheet = ss.getSheetByName("Couples");
    const rows = sheet.getDataRange().getValues();
    if (rows.some(r => r[0] === b.code)) {
      return json({ ok:false, msg:"Couple code already exists" });
    }
    sheet.appendRow([b.code, b.pin, b.names]);
    return json({ ok:true });
  }

  if (b.action === "chat") {
    ss.getSheetByName("Chat")
      .appendRow([b.code, new Date(), b.sender, b.msg]);
    return json("sent");
  }

  if (b.action === "note") {
    ss.getSheetByName("LoveNotes")
      .appendRow([b.code, new Date(), b.note]);
    return json("saved");
  }

  if (b.action === "gallery") {
    ss.getSheetByName("Gallery")
      .appendRow([b.code, new Date(), b.url, b.caption]);
    return json("added");
  }

  if (b.action === "check") {
    const sheet = ss.getSheetByName("Checklist");
    const rows = sheet.getDataRange().getValues();
    rows.forEach((r,i)=>{
      if(r[0]==b.code && r[1]==b.id){
        sheet.getRange(i+1,4).setValue(b.done);
      }
    });
    return json("updated");
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(e.type);
  const rows = sheet.getDataRange().getValues();
  return json(rows.slice(1).filter(r => r[0] == e.code));
}

function json(data){
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
