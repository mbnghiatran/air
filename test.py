from src.general import read_yaml_file

if __name__ == "__main__":
    data = read_yaml_file("./data/config.yaml")
    print(data)
    