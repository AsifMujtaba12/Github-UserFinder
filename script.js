const searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", () => {
  const username = document.querySelector("#username").value;
  if (username) {
    getUserName(username);
  } else {
    alert("Please enter a username");
  }
});
// Profile Data
const getUserName = async (username) => {
  try {
    const profileData = await fetch(`https://api.github.com/users/${username}`);
    if (!profileData.ok) {
      throw new Error(`HTTP error! status: ${profileData.status}`);
    }
    // console.log(profileData);
    const userData = await profileData.json();
    displayUserData(userData);
    document.querySelector("#username").value = "";
    // Store user data in localStorage 
    localStorage.setItem("userData", JSON.stringify(userData));
    // repos
    fetchRepoData(username);
    // displayUserData(userData,repoData);
    // console.log(userData);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching user data");
  }
};
// Fetching Repositories
const fetchRepoData= async (username) => {
  try{
    const reposData = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  console.log(reposData);
  if (!reposData.ok) {
    throw new Error(`HTTP error! status: ${reposData.status}`);
  }
  const repoData = await reposData.json();
  // console.log(repoData);
  displayRepoData(repoData);
  // Store repository data in localStorage 
  localStorage.setItem("repoData", JSON.stringify(repoData));
}catch(error) {
  console.error("Error:", error);
  alert("An error occurred while fetching repository data");
}
}


function displayUserData(userData) {
  const profileDiv = document.querySelector("#profile-container");
  profileDiv.innerHTML = `

    <div id="profile" class="flex items-center justify-evenly rounded-lg bg-gray-800 gap-10">
      <div id="img">
      <img  src="${
        userData.avatar_url
      }" class="object-cover ml-5 w-50 h-50  rounded-full">
      </div>
      <div id="info" class="flex flex-col  gap-2 bg-gray-200 rounded-tr-md rounded-br-md p-4 w-full">
      <h2 class="text-2xl">${userData.login}</h2>
      <h3><a class="text-2xl  text-blue-500" href="${
        userData.html_url
      }" target="_blank">@${userData.login}</a></h3>

     <p><strong>Bio:</strong> ${userData.bio || "This Profile has no Bio"}</p>
      <p><strong><i class="ri-map-pin-line"></i>:</strong> ${userData.location || "Not available"}</p>
       <p><strong><i class="ri-twitter-x-line"></i>:</strong> ${
         userData.twitter_username || "Not available"
       }</p>
        <p><strong>Followers:</strong> ${userData.followers}</p> 
        <p><strong>Following:</strong> ${userData.following}</p>
      
         <p><strong>Public Repos:</strong> ${userData.public_repos}</p>
      
      </div>
    </div>
`

}
function displayRepoData(repoData) {
  const repoDiv = document.querySelector("#reposdata");
  repoDiv.innerHTML = "";
  repoData.forEach((repo) => {
    repoDiv.innerHTML += `
    <div class="flex items-center justify-between rounded-lg bg-gray-200 p-4 shadow-md hover:bg-gray-300  transition-colors duration-300 ease-in-out gap-10 mb-4">
  <h2 class="text-xl font-semibold text-gray-800 ">${repo.name}</h2>
  <a class="text-blue-500 hover:text-blue-700" href="${repo.html_url}" target="_blank">View Repository</a>
</div>

    `
  });
}
// Load data from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedUserData = localStorage.getItem("userData");
  const storedRepoData = localStorage.getItem("repoData");

  if (storedUserData) {
    displayUserData(JSON.parse(storedUserData));
  }

  if (storedRepoData) {
    displayRepoData(JSON.parse(storedRepoData));
  }
});
