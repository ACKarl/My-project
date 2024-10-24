// frontend/js/data_source.js
export default {
  name: 'DataSource',
  setup() {
    const { ref, reactive, onMounted } = Vue;

    const buckets = ref([]);
    const measurements = ref([]);
    const fields = ref([]);

    const selectedItems = reactive({
      bucket: null,
      measurements: [],
      fields: []
    });

    // Use backend API to fetch bucket lists. 
    const fetchBuckets = async () => {
      try {
        const token = sessionStorage.getItem('influxToken');
        const org = sessionStorage.getItem('orgName');
    
        if (!token || !org) {
          console.error('Missing token or organization name');
          return;
        }
    
        const response = await fetch('/api/data-source/buckets', {
          headers: {
            'Authorization': `Token ${token}`,
            'X-Org-Name': org
          }
        });
    
        const data = await response.json();
        if (response.status === 200) {
          buckets.value = data;
        } else {
          console.error('Failed to fetch buckets:', data.message);
        }
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    };    

    // Use backend API to fetch measurement lists. 
    const fetchMeasurements = async (bucket) => {
      try {
        const token = sessionStorage.getItem('influxToken');
        const org = sessionStorage.getItem('orgName');
    
        if (!token || !org) {
          console.error('Missing token or organization name');
          return;
        }
    
        const response = await fetch(`/api/data-source/measurements?bucket=${bucket}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'X-Org-Name': org
          }
        });
    
        const data = await response.json();
        if (response.status === 200) {
          measurements.value = data;
        } else {
          console.error('Failed to fetch measurements:', data.message);
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };    

    // Use backend API to fetch field lists. 
    const fetchFields = async (bucket, measurement) => {
      try {
        const token = sessionStorage.getItem('influxToken');
        const org = sessionStorage.getItem('orgName');
    
        if (!token || !org) {
          console.error('Missing token or organization name');
          return;
        }
    
        const response = await fetch(`/api/data-source/fields?bucket=${bucket}&measurement=${measurement}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'X-Org-Name': org
          }
        });
    
        const data = await response.json();
        if (response.status === 200) {
          fields.value.push(...data.map(field => ({ field, measurement }))); // 保存每个字段和对应的测量值
        } else {
          console.error('Failed to fetch fields:', data.message);
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    const onDragStart = (event, item, type) => {
      event.dataTransfer.setData('text/plain', JSON.stringify({ item, type }));
    };

    const onDrop = (event) => {
      event.preventDefault();
      const { item, type } = JSON.parse(event.dataTransfer.getData('text/plain'));
    
      if (type === 'bucket') {
        selectedItems.bucket = { value: item, type: 'bucket' };
        selectedItems.measurements = [];
        selectedItems.fields = [];
        fetchMeasurements(item);
      } else if (type === 'measurement') {
        if (!selectedItems.measurements.some(measurement => measurement.value === item)) {
          selectedItems.measurements.push({ value: item, type: 'measurement' });
          fetchFields(selectedItems.bucket.value, item);
        }
      } else if (type === 'field') {
        if (!selectedItems.fields.some(field => field.value === item.field && field.measurement === item.measurement)) {
          selectedItems.fields.push({ value: item.field, type: 'field', measurement: item.measurement });
        }
      }
    };

    const getClassForType = (type) => {
      switch (type) {
        case 'bucket':
          return 'bucket-item';
        case 'measurement':
          return 'measurement-item';
        case 'field':
          return 'field-item';
        default:
          return '';
      }
    };

    const onDragOver = (event) => {
      event.preventDefault();
    };

    onMounted(() => {
      fetchBuckets();
    });

    return {
      buckets,
      measurements,
      fields,
      selectedItems,
      onDragStart,
      onDrop,
      onDragOver,
      getClassForType
    };
  },
  template: `
    <h2 id="title">Data Source</h2>
    <div class="core-content">
      <div class="source-lists">
        <div class="bucket-list">
          <h3>Buckets</h3>
          <ul>
            <li v-for="bucket in buckets" :key="bucket" draggable="true" @dragstart="onDragStart($event, bucket, 'bucket')">
              {{ bucket }}
            </li>
          </ul>
        </div>
        <div class="measurement-list">
          <h3>Measurements</h3>
          <ul>
            <li v-for="measurement in measurements" 
                :key="measurement" 
                draggable="true" 
                @dragstart="onDragStart($event, measurement, 'measurement')" 
                :title="measurement">
                <span class="measurement-name">
                    {{ measurement.length > 20 ? measurement.substring(0, 17) + '...' : measurement }}
                </span>
            </li>
          </ul>
        </div>
        <div class="field-list">
          <h3>Fields</h3>
          <ul class="field-list-container">
            <li v-for="field in fields" :key="field.field + field.measurement" draggable="true" @dragstart="onDragStart($event, field, 'field')" :title="field.field">
              <span class="field-name">{{ field.field.length > 20 ? field.field.substring(0, 17) + '...' : field.field }}</span>
              <span class="measurement-info">{{ field.measurement }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="selected-items" @drop="onDrop" @dragover="onDragOver">
        <h3>Selected Items</h3>
        <div v-if="selectedItems.bucket" :class="getClassForType(selectedItems.bucket.type)">
          {{ selectedItems.bucket.value }}
        </div>
        <div v-for="measurement in selectedItems.measurements" 
            :key="measurement.value" 
            :class="getClassForType(measurement.type)" 
            :title="measurement.value">
            <span class="measurement-name">
                {{ measurement.value.length > 20 ? measurement.value.substring(0, 17) + '...' : measurement.value }}
            </span>
        </div>
        <div v-for="field in selectedItems.fields" :key="field.value + field.measurement" :class="getClassForType(field.type)">
          <span class="field-name">{{ field.value.length > 20 ? field.value.substring(0, 17) + '...' : field.value }}</span>
          <span class="measurement-info">{{ field.measurement }}</span>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button>Clear</button>
      <button>Next</button>
    </div>
  `
};
