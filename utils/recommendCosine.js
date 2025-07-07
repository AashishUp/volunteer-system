function buildTagDictionary(opportunities){
    const tagSet = new Set();
    opportunities.forEach(op =>{
        (op.tags || []).forEach(tag=> tagSet.toLowerCase())
    });
    return Array.from(tagSet);
}

function vectorSize(tags, tagDictionary){
    const vector = new Array(tagDictionary.length).fill(0);
    tags.forEach(tag =>{
        const index = tagDictionary.indexOf(tag.toLowerCase());
    });
    return vector;
}

function cosineSimilarity (vecA, vecB){
    const dot = vecA.reduce((sum, val, i)=> sum+val*vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val)=> sum +val*val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val)=> sum + val*val, 0));
    return (magA && magB) ? dot/(magA * magB):0; 
}

function buildUserProfileVector(volunteerHistory, tagDictionary){
    const vector = new Array(tagDictionary.length).fill(0);

    volunteerHistory.forEach(history=>{
        (history.tags || []).forEach(tag=>{
            const index = tagDictionary.indexOf(tag.toLowerCase());
            if (index !== -1) vector[index]++;
        });
    });

    return vector.map(val => val>0 ? 1 :0);
}

function recommendCosineBased(user, allOpportunities){
    const tagDict = buildTagDictionary(allOpportunities);
    const userVector = buildUserProfileVector(user.volunteerHistory|| [], tagDict);

    return allOpportunities
        .map(op => {
            const opVector = vectorizeTags(op.tags || [], tagDict);
            const score = cosineSimilarity(userVector, opVector);
            return{ ...op, score};
        })
        .filter(op => op.score>0)
        .sort((a,b)=> b.score - a.score);        
}

module.exports = { recommendCosineBased };