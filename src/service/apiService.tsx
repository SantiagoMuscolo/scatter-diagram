export async function getData(): Promise<Array<[number, string, string, Date]>> {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    const jsonData = await response.json();

    const processedData = jsonData.map((item: any) => {
        return [item.Place, item.Seconds, item.Time, new Date(1970, 0, 1, 0, item.Seconds, 0)];
    });

    return processedData;
}