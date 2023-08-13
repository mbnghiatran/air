const likeTwitter = async (driver) => {
    const idElement = "//div[@aria-label='Like']";
    await driver.wait(until.elementLocated(By.xpath(idElement)), 10000);
    const likeBtnEle = await driver.findElement(By.xpath(idElement));
    driver.executeScript("arguments[0].click();", likeBtnEle);
  };
  
  const retweetTW = async (driver) => {
    const iconIdElement = "//div[@aria-label='Retweet']";
    await driver.wait(until.elementLocated(By.xpath(iconIdElement)), 10000);
    const retweetIcon = await driver.findElement(By.xpath(iconIdElement));
    driver.executeScript("arguments[0].click();", retweetIcon);
  
    const retweetElement = "//div[@data-testid='retweetConfirm']";
    await driver.wait(until.elementLocated(By.xpath(retweetElement)), 10000);
    const retweetBtn = await driver.findElement(By.xpath(retweetElement));
    driver.executeScript("arguments[0].click();", retweetBtn);
  };
  
  const replyTW = async (driver) => {
    const twitterUsers = excelData.map((x) => "@" + x.Twitter);
    const textEditorElementId = "//div[@aria-label='Tweet text']";
    await driver.wait(until.elementLocated(By.xpath(textEditorElementId)), 10000);
    const textEditorElement = await driver.findElement(
      By.xpath(textEditorElementId)
    );
    driver.executeScript("arguments[0].click();", textEditorElement);
    textEditorElement.sendKeys(
      "7 Restaurants in Rome Locals Love " +
        getRandomElementsFromArray(twitterUsers, 3).join(" ")
    );
  
    const replyElementBtn = "//div[@data-testid='tweetButtonInline']";
    await driver.wait(until.elementLocated(By.xpath(replyElementBtn)), 10000);
    const replyBtn = await driver.findElement(By.xpath(replyElementBtn));
    driver.executeScript("arguments[0].click();", replyBtn);
  };