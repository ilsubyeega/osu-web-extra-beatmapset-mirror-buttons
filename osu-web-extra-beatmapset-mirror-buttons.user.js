// ==UserScript==
// @name         osu-web Extra: Beatmapset Page Mirror Buttons
// @namespace    https://userscripts.fmt.kr/
// @version      1.0.1
// @description  Adds Nerinyan and Beatconnect mirror buttons to the beatmapset page on osu-web (osu.ppy.sh)
// @author       fmtkr (ilsubyeega)
// @match        https://osu.ppy.sh/*
// @icon         https://osu.ppy.sh/images/favicon/favicon-32x32.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const beatmapset_url_pattern = /osu\.ppy\.sh\/beatmapsets\/(\d+)#(osu|taiko|fruits|mania)(?:\/(\d+))?/;

  const checkThisIsBeatmapsetPage = (url) => beatmapset_url_pattern.test(url);

  const extractDataFromBeatmapsetPage = (url) => {
    const matches = url.match(beatmapset_url_pattern);
    if (matches) {
      const beatmapset_id = matches[1];
      const game_mode = matches[2];
      const beatmap_id = matches[3];
      return { beatmapset_id, beatmap_id, game_mode };
    } else {
      return null;
    }
  };

  // URL Change Handler
  let currentURL = '';
  const handleURLChange = () => {
    if (currentURL !== window.location.href) {
      console.log('URL has changed:', currentURL, '->', window.location.href);
      currentURL = window.location.href;

      if (checkThisIsBeatmapsetPage(window.location.href)) {
        const { beatmapset_id, beatmap_id, game_mode } = extractDataFromBeatmapsetPage(window.location.href);
        console.log('Beatmapset ID:', beatmapset_id);
        console.log('Beatmap ID:', beatmap_id);
        console.log('Game Mode:', game_mode);
        const buttons = createBeatmapsetButtons(beatmapset_id, beatmap_id);

        const beatmapset_info_container = document.querySelector('.beatmapset-info');
        if (beatmapset_info_container) {
          if (document.getElementById('fmtkr-mirror-buttons')) {
            document.getElementById('fmtkr-mirror-buttons').remove();
          }
          beatmapset_info_container.parentNode.insertBefore(buttons, beatmapset_info_container.nextSibling);
        } else {
          console.log('Beatmapset info container not found.');
        }
      }
    }
  }
  setInterval(handleURLChange, 250);

  // Beatmapset Button Creator
  const createBeatmapsetButtons = (beatmapset_id, beatmap_id) => {
    const createButton = (href, bgValue, hoverBgValue, textTop, iconClass) => {
      const button = document.createElement('a');
      button.className = 'btn-osu-big';
      button.href = href;
      button.dataset.turbolinks = 'false';
      button.style.setProperty('--bg', bgValue);
      button.style.setProperty('--hover-bg', hoverBgValue);
      button.target = '_blank';

      const contentSpan = document.createElement('span');
      contentSpan.className = 'btn-osu-big__content';

      const leftSpan = document.createElement('span');
      leftSpan.className = 'btn-osu-big__left';

      const textTopSpan = document.createElement('span');
      textTopSpan.className = 'btn-osu-big__text-top';
      textTopSpan.textContent = textTop;

      leftSpan.appendChild(textTopSpan);

      const iconSpan = document.createElement('span');
      iconSpan.className = 'btn-osu-big__icon';

      const faSpan = document.createElement('span');
      faSpan.className = 'fa fa-fw';

      const innerIconSpan = document.createElement('span');
      innerIconSpan.className = iconClass;

      faSpan.appendChild(innerIconSpan);
      iconSpan.appendChild(faSpan);

      contentSpan.appendChild(leftSpan);
      contentSpan.appendChild(iconSpan);

      button.appendChild(contentSpan);

      return button;
    }

    const mainContainer = document.createElement('div');
    mainContainer.style.marginTop = '10px';
    mainContainer.style.marginLeft = '10px';
    mainContainer.style.display = 'flex';
    mainContainer.style.gap = '10px';
    mainContainer.id = "fmtkr-mirror-buttons";

    [
      createButton(
        `https://api.nerinyan.moe/d/${beatmapset_id}`,
        'hsl(300, 50%, 45%)',
        'hsl(300, 100%, 70%)',
        'Nerinyan: Download',
        'fas fa-download'
      ),
      createButton(
        `https://subapi.nerinyan.moe/bg/-${beatmapset_id}`,
        'hsl(300, 50%, 45%)',
        'hsl(300, 100%, 70%)',
        'Nerinyan: BG Image',
        'fas fa-image'
      ),
      createButton(
        `https://beatconnect.io/b/${beatmapset_id}`,
        'hsl(255, 50%, 45%)',
        'hsl(255, 100%, 70%)',
        'Beatconnect: Download',
        'fas fa-download'
      ),
      createButton(
        `https://beatconnect.io/bg/${beatmapset_id}/${beatmap_id || 'default'}`,
        'hsl(255, 50%, 45%)',
        'hsl(255, 100%, 70%)',
        'Beatconnect: BG Image',
        'fas fa-image'
      ),
      createButton(
        `https://beatconnect.io/audio/${beatmapset_id}/${beatmap_id || 'default'}`,
        'hsl(255, 50%, 45%)',
        'hsl(255, 100%, 70%)',
        'Beatconnect: Audio',
        'fas fa-music'
      ),
    ].forEach(a => mainContainer.appendChild(a))

    return mainContainer;
  }
})();
