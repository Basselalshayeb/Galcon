using System.Collections;
using System.Collections.Generic;
using WebSocketSharp;
using UnityEngine;

public class MPcreating_script : MonoBehaviour {
    public GameObject ship;
    public GameObject parent;
    WebSocket webSocket;
    GameObject[] attack;
    GameObject[] Planets;
    int x;
    // Use this for initialization
    void Start()
    {
        webSocket= new WebSocket("http://localhost:8080");
        webSocket.Connect();
        int n = 4;
        //number of clicks 2 clicks
        attack = new GameObject[n];
        //n number of planets in the world
        Planets = new GameObject[n];
    }

    // Update is called once per frame
    void Update()
    {
        webSocket.OnMessage += (sender, e) =>
        {





            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out hit))
            {
                var ourObject = hit.collider.gameObject.name;
                if (hit.collider.gameObject.tag == "Ball")
                {
                    //new
                    if (hit.collider.gameObject.GetComponent<Planet_scripte>()._forwhoisthisplanet == "me")
                    {
                        attack[x] = hit.collider.gameObject;
                        x++;
                    }
                    else
                    {
                        if (x != 0)
                        {


                            attack[x] = hit.collider.gameObject;

                            for (int i = 0; i < x; i++)
                            {
                                //Debug.Log(attack[i].transform.position.ToString());
                                float teta = -Mathf.PI / 2, beta = -Mathf.PI, xx, y, z = attack[i].transform.position.z - 1f, r = 0.7f;
                                for (int j = 0; j < attack[i].GetComponent<Planet_scripte>()._ammo; j++)
                                {
                                    xx = attack[i].transform.position.x + Mathf.Sin(beta) * r;
                                    y = attack[i].transform.position.y + Mathf.Cos(beta) * r;
                                    z = z + 0.005f;
                                    //if more than 200 add another layer of ships
                                    if (j % 200 == 0)
                                    {
                                        r += 0.2f;
                                        beta = -Mathf.PI;
                                        z = attack[i].transform.position.z - 1f;
                                    }
                                    //teta += 0.5f;
                                    beta = beta + 1f;
                                    if (j % 100 == 0)
                                    {
                                        parent = new GameObject();
                                        parent.name = "zaid" + j;
                                        parent.transform.position = attack[i].transform.position;// -new Vector3(1,1,1);
                                        parent.AddComponent<Parent_move>();
                                        parent.GetComponent<Parent_move>()._dist = attack[x].transform.position;
                                    }

                                    GameObject bullet = Instantiate(ship);
                                    bullet.transform.position = attack[i].transform.position;// new Vector3(parent.transform.position.x, parent.transform.position.y, attack[0].transform.position.z);
                                    bullet.GetComponent<ship_scripte>()._dist = attack[x].transform.position;
                                    bullet.GetComponent<ship_scripte>()._distObject = attack[x];
                                    bullet.GetComponent<ship_scripte>()._belongto = attack[i].GetComponent<Planet_scripte>()._forwhoisthisplanet;
                                    bullet.transform.position = new Vector3(xx, y, z);
                                    bullet.transform.SetParent(parent.transform);
                                }
                            }

                            //Debug.Log("sds1");
                            //Reset the x so we can hit again
                            x = 0;
                        }
                    }
                    //!new




                    //old 
                    /*attack[x] = hit.collider.gameObject;
                    x++;
                    if (x == 2)
                    {
                        x = 0;
                        //if he clicked on the same planet
                        if (attack[1].name == attack[0].name)
                        {

                        }

                        //number of going ships algorithm
                        float teta =-Mathf.PI/2, beta = -Mathf.PI, xx, y, z=attack[0].transform.position.z-1f, r =0.7f;
                        for (int i = 0; i < attack[0].GetComponent<Planet_scripte>()._ammo; i++)
                        {
                            xx =attack[0].transform.position.x+ Mathf.Sin(beta)*r;
                            y = attack[0].transform.position.y+ Mathf.Cos(beta)*r;
                            z = z +0.005f;
                            //if more than 200 add another layer of ships
                            if (i % 200==0)
                            {
                                r +=0.2f;
                                beta = -Mathf.PI;
                                z = attack[0].transform.position.z - 1f;
                            }
                            //teta += 0.5f;
                            beta =beta+ 1f;
                            if (i % 100 == 0)
                            {
                                parent = new GameObject();
                                parent.name = "zaid" + i;
                                parent.transform.position = attack[0].transform.position;// -new Vector3(1,1,1);
                                parent.AddComponent<Parent_move>();
                                parent.GetComponent<Parent_move>()._dist = attack[1].transform.position;
                            }
                            GameObject bullet = Instantiate(ship);
                            bullet.transform.position = attack[0].transform.position;// new Vector3(parent.transform.position.x, parent.transform.position.y, attack[0].transform.position.z);
                            bullet.GetComponent<ship_scripte>()._dist = attack[1].transform.position;
                            bullet.GetComponent<ship_scripte>()._distObject = attack[1];
                            bullet.GetComponent<ship_scripte>()._belongto = attack[0].GetComponent<Planet_scripte>()._forwhoisthisplanet;
                            //the new position
                            bullet.transform.position = new Vector3(xx,y,z);
                            bullet.transform.SetParent(parent.transform);
                        }

                       //to see of it is working
                       //hit.transform.gameObject.GetComponent<Renderer>().material.color = new Color(0.5f, 0.5f, 0.5f, 1);
                       
                    }*/
                    //!old
                }

                //Debug.Log("object that was hit: " + ourObject);
            }
        };
    }
}
