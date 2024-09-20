import fetch from 'node-fetch';

async function action(headers: Record<string, string>): Promise<boolean> {
  const res = await fetch(
    "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
    {
      method: "POST",
      headers,
    }
  );

  const json = await res.json();
  return res.status === 201;
}

async function getNextTime(headers: Record<string, string>): Promise<number> {
  const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
    headers,
  });

  if (res.status !== 200) {
    throw new Error("Get missions request failed");
  }

  const data = await res.json();
  return data["SPECIAL MISSION"][0]["next_time_execute"];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleToken(authToken: string): Promise<void> {
  const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };
  let nextTime = await getNextTime(headers);

  while (true) {
    const now = Math.floor(Date.now() / 1000);
    
    if (now >= nextTime) {
      const result = await action(headers);
      if (result) {
        console.log(`Success: Action to earn was successfully completed with token ${authToken}`);
        nextTime = await getNextTime(headers);
        console.log(`Success: Got new nextTime with token ${authToken}: ${nextTime}`);
      } else {
        console.log(`Failed: Action to earn failed with token ${authToken}`);
      }
    } else {
      // console.log(`Waiting: Time left for next action with token ${authToken}: ${nextTime - now}s`);
    }

    await delay(1000);
  }
}

async function makeMoney(authTokens: string[]): Promise<void> {
  // Create an array of promises, one for each token
  const promises = authTokens.map(token => handleToken(token));

  // Use Promise.all to run all promises concurrently
  await Promise.all(promises);
}

// List of your authorization tokens
const authTokens: string[] = [
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTAzZDk1NGI2OTAxNzgwMDk5ZWE5IiwiaWF0IjoxNzI2ODc0NTg2LCJleHAiOjE3MjY5NjA5ODYsInR5cGUiOiJhY2Nlc3MifQ.7ScySwuYovsGLAeBQeMs3qtua-1SphFrGWYEjI-cC6g",
  //09045087864
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0NWMxMjM0Y2ZkYTZlZDc5Yjk5IiwiaWF0IjoxNzI2ODc0NzE3LCJleHAiOjE3MjY5NjExMTcsInR5cGUiOiJhY2Nlc3MifQ.qAFS2VbAmEbxMG9AiNUNnMuOT0dMT10_df81f0VAgvQ",
  //09365087864
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI2ODI3Mjg3LCJleHAiOjE3MjY5MTM2ODcsInR5cGUiOiJhY2Nlc3MifQ.z07ZG58BzZZAHVYFz_w6uc6Dg0Fo-sZzQc7BK7yTsAE",
  //09191493905


];

makeMoney(authTokens);

console.log("Executed: Started...");
