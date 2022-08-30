import { h } from 'cary-tsx-dom';
import type { SearchableSelectConfiguration } from '../components/combobox/combobox';
import { SearchableSelect } from '../components/combobox/combobox';
import './style.css';
import '../components/combobox/style.less';

const appContainer = document.querySelector<HTMLDivElement>('#app');

appContainer?.appendChild(<p class="read-the-docs">A selector for GC Pay</p>);

const searchableSelect = <input id="custom-input" name="custom-input" class="custom-class" placeholder="search"></input> as HTMLInputElement;
appContainer?.appendChild(searchableSelect);

const searchableConfig = {
  data: [],
} as SearchableSelectConfiguration;
searchableConfig.data.push(...[
  { value: 'c36ff37f5e094c5cbfc5d48021446e58', displayName: '西安葡萄城软件有限公司' },
  { value: '52e48527ab944f1a8b359209a6862edf', displayName: 'testp' },
  { value: '4b14c2e77e784a0e8714eb2416663211', displayName: '123' },
  { value: '57ac6393ce334afb88969ae705862d60', displayName: '小星的店铺' },
  { value: 'e3a9bb6ad5ca4498946ade83bd90d964', displayName: '欢欢店铺' },
  { value: '1fb70801522442fba299cd30c77c1f87', displayName: '欢欢的店铺h' },
  { value: '4b5578758152462ea33d83f56f5e0dc7', displayName: '欢欢的店铺' },
  { value: '5d7dc6b467cf419f8bfa6e120dfe7e6c', displayName: '羊村企业有限公司' },
  { value: '1c3c4a6d8ccc47ffb26372cbb9694872', displayName: 'lcc2' },
  { value: 'fdcaf038e7c445efbaebbdc2f963f9a1', displayName: 'lcc' },
  { value: '7e8a1adfca6946778d139109fc3c1015', displayName: 'lxx3' },
  { value: '315210ac09234728920774e5931dff67', displayName: 'lxx2' },
  { value: '45723581a86f40ad9c771dd80f3d63ce', displayName: 'lxx' },
  { value: '80f25f98f9644bf5a7a7767f5c3c3105', displayName: '小兰' },
  { value: 'ac61a42a28394969972144d05a2a4a87', displayName: '小灰灰软件有限公司' },
  { value: '526c684c8f1742f29b1de8099e016482', displayName: '测试葡萄城市场有限公司与' },
  { value: '6e4a0401bc7f450c844c1779030f254e', displayName: '长沙摩羯座软件' },
  { value: 'a6a63c1786724c768323c9a65a52476c', displayName: '活字格学徒' },
  { value: '05a05b9c13b04115b265af3046a5d1c8', displayName: 'chenxi' },
  { value: '6cad54a505ae472e99622592267ca9b6', displayName: 'leili' },
  { value: '45ab234b6c0447be847293ad1ee95272', displayName: 'XingerPersonal' },
  { value: '6c87776ada7a4062928229fe01fce14b', displayName: 'xinger' },
  { value: '668de50a5c9d455ba55f5756c9953bf2', displayName: '旅行者有' },
  { value: '6b981fb18a354276875c059c23ab5898', displayName: '西安葡萄城' },
  { value: 'ea29fc849230430087a951b12eb070c3', displayName: '小明科技有限公司' },
  { value: '5b61791ed92c434da93c88de931be319', displayName: 'aaa' }]);
for (let index = 0; index < 26; index++) {
  searchableConfig.data.push({
    value: String.fromCharCode(97 + index),
    displayName: String.fromCharCode(65 + index).repeat(100),
  });
}

new SearchableSelect(searchableSelect, searchableConfig);

