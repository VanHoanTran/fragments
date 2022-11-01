//write your own tests here for ../../src/model/data/memory/index.js
const { listFragments, writeFragment, readFragment, writeFragmentData, readFragmentData, deleteFragment} = require('../../src/model/data/memory/index');


describe('memory', () => {


test("readFragment() return a fragment's metadata from memory db", async() =>{
    const fragment = {
        ownerId : 'a',
        id : 'b',
        extra: {}
    };
    await writeFragment(fragment);
    const result = await readFragment('a', 'b');
    expect(result).toEqual(fragment);
});


test("readFragmentData() returns a fragment's data from memory db", async() =>{
    const fragment = {
        ownerId : 'a',
        id : '1',
        value: Buffer.from([1, 2, 3])
    };

    await writeFragmentData(fragment.ownerId, fragment.id, fragment.value);
    const result = await readFragmentData('a', '1');
    expect(result).toEqual(fragment.value);

});


test("listFragments(, expend = false) returns a array of fragment ids", async() =>{
    const fragment1 =  {ownerId: 'owner', id: 'one', fragment: Buffer.from([1, 2, 3])};
    const fragment2 =  {ownerId: 'owner', id: 'two', fragment: Buffer.from([4, 5, 6])};
    const fragment3 =  {ownerId: 'owner', id: 'three', fragment: Buffer.from([7, 8, 8])};

    await writeFragment(fragment1);
    await writeFragment(fragment2);
    await writeFragment(fragment3);

    const result1 = await listFragments('owner');
    expect(Array.isArray(result1)).toBe(true);
    expect(result1).toEqual([fragment1.id, fragment2.id,fragment3.id]);

});


test("listFragments(, expend = true) returns a array of fragment objects", async() =>{
    const fragment1 =  {ownerId: 'owner', id: 'one', fragment: Buffer.from([1, 2, 3])};
    const fragment2 =  {ownerId: 'owner', id: 'two', fragment: Buffer.from([4, 5, 6])};
    const fragment3 =  {ownerId: 'owner', id: 'three', fragment: Buffer.from([7, 8, 8])};

    await writeFragment(fragment1);
    await writeFragment(fragment2);
    await writeFragment(fragment3);

    const result = await listFragments('owner', true);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([fragment1, fragment2,fragment3]);
});

test("readFragment() and readFragmentData() returns undefined after deleteFragment()", async() =>{
    const fragment = {
        ownerId : 'a',
        id : 'b',
        extra: {}
    };
    await writeFragment(fragment);
    await writeFragmentData('a', 'b', 123);
    await deleteFragment('a', 'b');
    const metadata = await readFragment('a', 'b');
    const data = await readFragmentData('a', 'b');
    expect(metadata).toBe(undefined);
    expect(data).toBe(undefined);

});

});
