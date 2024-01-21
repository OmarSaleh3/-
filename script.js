const api_url = 'https://mp3quran.net/api/v3'
const language = 'ar'

async function getReciters (){
    const chooseReciter = document.querySelector('#chooseReciter')
    const res = await fetch(`${api_url}/reciters?language=${language}`)
    const data = await res.json()

    chooseReciter.innerHTML = `<option value =''> اختر قارئ </option>`;
data.reciters.forEach(reciter => 
    chooseReciter.innerHTML += `<option value ='${reciter.id}'> ${reciter.name} </option>`);

    chooseReciter.addEventListener('change' , (e) => getMoshaf(e.target.value))
}
getReciters()


async function getMoshaf (reciter) {
    const chooseMoshaf = document.querySelector('#chooseMoshaf')
    const res = await fetch(`${api_url}/reciters?language=${language}&reciter=${reciter}`)
    const data = await res.json()
    const moshafs = data.reciters[0].moshaf
    chooseMoshaf.innerHTML = `<option value = ""  data-server = "" data-surahList = ""> اختر الروايه </option>`
    moshafs.forEach( moshaf => {
        chooseMoshaf.innerHTML += `<option value = "${moshaf.id}"  data-server = "${moshaf.server}" data-surahList = "${moshaf.surah_list}"> ${moshaf.name} </option>`
    })
    
    chooseMoshaf.addEventListener('change' , e=> {
        const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex]

        const server = selectedMoshaf.dataset.server
        const surahlist = selectedMoshaf.dataset.surahlist
        getSurah(server , surahlist)
    })
}

async function getSurah (server , surahlist){
    const chooseSurah = document.querySelector('#chooseSurah')
    const res = await fetch(`https://mp3quran.net/api/v3/suwar`)
    const data = await res.json()
    const suraNames = data.suwar;
    surahlist = surahlist.split(',')

    chooseSurah.innerHTML = `<option value = "">اختر السوره</option>`
    surahlist.forEach(surah => {
        const padTosurh  =  surah.padStart(3 , '0')
        suraNames.forEach(suraName => {
            if(suraName.id == surah){
                chooseSurah.innerHTML += `<option value = "${server}${padTosurh}.mp3"> ${suraName.name} </option>`
            }
        })
    })


    chooseSurah.addEventListener('change' , e => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
        playSurah(selectedSurah.value);
} )
}

function playSurah ( surahMp3){
    const audioPlayer = document.querySelector('#audioPlayer')
    audioPlayer.src = surahMp3
    audioPlayer.play()
}

function playLive (channel){
    if(Hls.isSupported()) {
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(channel);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
     }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://d26g5bnklkwsh4.cloudfront.net/adf856d9-a233-484b-a730-f7ac57c53aa5/master.m3u8';
        video.addEventListener('canplay',function() {
          video.play();
        });
      }
}