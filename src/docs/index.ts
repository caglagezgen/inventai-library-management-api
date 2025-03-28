import libraryManagement from './libraryManagement.js';
import basicInfo from './basicInfo.js';
import servers from './servers.js';
import components from './components.js';
import tags from './tags.js';

export default {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    paths: {
        ...libraryManagement
    }
};