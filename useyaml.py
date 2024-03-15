import yaml
import os

class FrigateYaml:
    def insertYaml(self, camera_name, inputs_path, objects_track):
        try:
            # 檢查 config.yaml 是否存在，如果不存在則建立一個空的字典
            if os.path.exists('config.yaml'):
                with open('config.yaml', 'r') as file:
                    data = yaml.safe_load(file)

                # 新增或更新 camera_name 部分的資料
                data.setdefault('cameras', {})[camera_name] = {
                    'record': {
                        'enabled': True
                    },
                    'snapshots': {
                        'enabled': True
                    },
                    'ffmpeg': {
                        'output_args': {
                            'record': 'preset-record-generic-audio-copy'
                        },
                        'inputs': [
                            {
                                'path': inputs_path,
                                # 'input_args': input_args,
                                # 'roles': ['detect']
                            }
                        ]
                    },
                    # 'objects': {
                    #     'track': objects_track
                    # }
                }

                with open('config.yaml', 'w') as file:
                    yaml.dump(data, file, default_flow_style=False)

                print('Config edit successful')
                return True
            else:
                data = {
                    'mqtt': {
                        'host': 'mqtt'
                    },
                    # 'detectors': {
                    #     'ov': {
                    #         'type': 'openvino',
                    #         'device': 'CPU',
                    #         'model': {
                    #             'path': '/workspace/frigate/export_yolov8/yolov8s_train20231217_constructionsite_640_n_v3/yolov8n/yolov8n.xml'
                    #         }
                    #     },
                    # },
                    # 'record': {
                    #     'enabled': True,
                    #     'events': {
                    #         'objects': ['NO-Hardhat', 'NO-Safety Vest'],
                    #         'pre_capture': 5,
                    #         'post_capture': 5,
                    #         'retain': {
                    #             'default': 10
                    #         }
                    #     }
                    # },
                    'snapshots': {
                        'enabled': True,
                        'retain': {
                            'default': 5
                        }
                    },
                    'cameras': {
                        camera_name: {
                            'record': {
                                'enabled': True
                            },
                            'snapshots': {
                                'enabled': True
                            },
                            'ffmpeg': {
                                'output_args': {
                                    'record': 'preset-record-generic-audio-copy'
                                },
                                'inputs': [
                                    {
                                        'path': inputs_path,
                                        # 'input_args': input_args,
                                        # 'roles': ['detect']
                                    }
                                ]
                            },
                            # 'objects': {
                            #     'track': objects_track
                            # }
                        },
                    },
                    # 'model': {
                    #     'width': 640,
                    #     'height': 640,
                    #     'input_tensor': 'nchw',
                    #     'input_pixel_format': 'bgr',
                    #     'model_type': 'yolov8',
                    #     'labelmap_path': '/workspace/frigate/export_yolov8/yolov8s_train20231217_constructionsite_640_n_v3/yolov8s_train20231217_constructionsite_640_n_v3.names'
                    # }
                }

                with open('config.yaml', 'w') as file:
                    yaml.dump(data, file, default_flow_style=False)

                print('Config add successful')
                return True
        except:
            return False

    def deleteYamlCam(camera_name):
        # 檢查 config.yaml 是否存在
        if os.path.exists('config.yaml'):
            with open('config.yaml', 'r') as file:
                data = yaml.safe_load(file)
        else:
            # 如果 config.yaml 不存在，則不需要進行任何操作
            return f'Camera {camera_name} does not exist in the configuration.'

        # 刪除指定的 camera_name
        if 'cameras' in data and camera_name in data['cameras']:
            del data['cameras'][camera_name]
            # 寫回 config.yaml 檔案
            with open('config.yaml', 'w') as file:
                yaml.dump(data, file, default_flow_style=False)
            print(f'Camera {camera_name} deleted successfully.')
            return True
        else:
            print(f'攝影機不存在')
            return False


    def __init__(self) -> None:
        pass